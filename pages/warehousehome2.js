import React, { useState, useEffect } from 'react';
import { Grid, Header, Segment, Form, Button, Confirm, Modal } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import pdsinstance from '../ethereum/pdsinstance';

const DashboardPage = () => {
  const [structData, setStructData] = useState({});
  const [wareHouseFormData, setWareHouseFormData] = useState({ wheat: '', rice: '', sugar: '' });
  const [transferToRationShopFormData, setTransferToRationShopFormData] = useState({ wheat: '', rice: '', sugar: '' });
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [currentApprovalIndex, setCurrentApprovalIndex] = useState(0);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [approvalResult, setApprovalResult] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    fetchDataFromContract();
  }, []);

  const fetchDataFromContract = async () => {
    try {
      const data = await pdsinstance.methods.warehouse().call();
      setStructData(data);
      
      // Fetch pending approvals
      const pendingApprovals = await pdsinstance.methods.getarrWHapproval().call();
      setApprovalRequests(pendingApprovals);
    } catch (error) {
      console.error('Error fetching data from contract:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setWareHouseFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTransferChange = (event) => {
    const { name, value } = event.target;
    setTransferToRationShopFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const currentApproval = approvalRequests[currentApprovalIndex];

  const handleApproveOrReject = async () => {
    const connected_account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
      const { wheat, rice, sugar } = wareHouseFormData;
      if (
        currentApproval &&
        currentApproval.wheat === wheat &&
        currentApproval.rice === rice &&
        currentApproval.sugar === sugar
      ) {
        // Approve the transfer
        await pdsinstance.methods.approveTransferToWarehouse(currentApproval.id).send({ 
          from: connected_account[0],
          chainId: 5777,
          gasPrice: 100000000000,
          gas: 3000000
        });
        setApprovalResult('approved');
      } else {
        // Reject the transfer
        await pdsinstance.methods.rejectTransferToWarehouse(currentApproval.id).send({ 
          from: connected_account[0],
          chainId: 5777,
          gasPrice: 100000000000,
          gas: 3000000
        });
        setApprovalResult('rejected');
      }
      // Fetch data again after approval or rejection
      await fetchDataFromContract();
      // Reset form data
      setWareHouseFormData({ wheat: '', rice: '', sugar: '' });
      //console.log(popupOpen);
      setPopupOpen(true);

    } catch (error) {
      console.error('Error approving or rejecting transfer:', error);
      setApprovalResult(null);
    }
  };

  const handleTransferToRationshop = async (event) => {
    event.preventDefault();
    const connected_account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
      await pdsinstance.methods.requestTransferToRationShop(transferToRationShopFormData.wheat, transferToRationShopFormData.rice, transferToRationShopFormData.sugar).send(
        { 
          from: connected_account[0],
          chainId: 5777,
          gasPrice: 100000000000,
          gas:3000000
        }
      );
      await fetchDataFromContract();
      // Reset form data
      setTransferToRationShopFormData({ wheat: '', rice: '', sugar: '' });
    } catch (error) {
      console.error('Error transferring to warehouse:', error);
    }
  };

  const handleViewCompleteShipmentSummary = () => {
    // Redirect to a new website for viewing complete shipment summary
    window.location.href = 'http://localhost:3000/shipmentsummary';
  };

  const handleConfirmation = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmationCancel = () => {
    setConfirmationOpen(false);
  };

  const handleConfirmationConfirm = async () => {
    setConfirmationOpen(false);
    await handleApproveOrReject();
  };

  const handlePreviousApproval = () => {
    setCurrentApprovalIndex((prevIndex) => (prevIndex - 1 + approvalRequests.length) % approvalRequests.length);
  };

  const handleNextApproval = () => {
    setCurrentApprovalIndex((prevIndex) => (prevIndex + 1) % approvalRequests.length);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setApprovalResult(null);
  };

  return (
    <div className="dashboard">
      <Grid textAlign="center" style={{ height: '100vh', margin: 0 }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 1000 }}>
          <Header as="h1" textAlign="center" style={{ marginTop: '1em', marginBottom: '2em', color:"#667778"}}>
            Warehouse Home
          </Header>
          <Segment.Group horizontal>
            <Segment className="stock-segment" style={{ backgroundColor: '#a2bebf', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
              <Header as="h3" textAlign="center" className="stock-header" style={{ fontSize: '1.5em', marginBottom: '1em', color:"#3d4748" }}>
                Warehouse Stock
              </Header>
              <div className="stock-details" style={{ marginTop: '1.5em', fontSize: '1.3em' }}>
                <p style={{ marginBottom: '1em' }}><span style={{ color: '#515f60' }}>WHEAT:</span> {structData.wheat}</p>
                <p style={{ marginBottom: '1em' }}><span style={{ color: '#515f60' }}>RICE:</span> {structData.rice}</p>
                <p><span style={{ color: '#515f60' }}>SUGAR:</span> {structData.sugar}</p>
              </div>
            </Segment>
            <Segment className="form-segment" style={{ backgroundColor: '#ffffff', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
              <Header as="h3" textAlign="center" style={{ fontSize: '1.5em', marginBottom: '1em', color:"#83999a" }}>
                Pending Approvals ({approvalRequests.length})
              </Header>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1em' }}>
                <Button icon="angle left" onClick={handlePreviousApproval} style={{ marginRight: '2.5em' }} />
                {currentApproval && (
                  <div>
                    <p>ID: {currentApproval.id}</p>
                    <p>Wheat: {currentApproval.wheat}</p>
                    <p>Rice: {currentApproval.rice}</p>
                    <p>Sugar: {currentApproval.sugar}</p>
                  </div>
                )}
                <Button icon="angle right" onClick={handleNextApproval} style={{ marginLeft: '2.5em' }} />
              </div>

              {currentApproval && (
                <div>
                  <Header as="h3" textAlign="center" style={{ fontSize: '1.5em', marginTop: '1em', marginBottom: '1em', color:"#83999a" }}>
                    Enter Received Weights
                  </Header>
                  <Form>
                    <Form.Field>
                      <label style={{ color: '#83999a', textAlign: 'center' }}>Wheat</label>
                      <input
                        type="number"
                        name="wheat"
                        value={wareHouseFormData.wheat}
                        onChange={handleChange}
                        style={{ fontSize: '1.3em', marginBottom: '1em', textAlign: 'center' }}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label style={{ color: '#83999a', textAlign: 'center' }}>Rice</label>
                      <input
                        type="number"
                        name="rice"
                        value={wareHouseFormData.rice}
                        onChange={handleChange}
                        style={{ fontSize: '1.3em', marginBottom: '1em', textAlign: 'center' }}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label style={{ color: '#83999a', textAlign: 'center' }}>Sugar</label>
                      <input
                        type="number"
                        name="sugar"
                        value={wareHouseFormData.sugar}
                        onChange={handleChange}
                        style={{ fontSize: '1.3em', marginBottom: '1em', textAlign: 'center' }}
                      />
                    </Form.Field>
                    <Button onClick={handleConfirmation} color="teal" style={{ fontSize: '1.3em' }}>Submit</Button>
                  </Form>
                  <Confirm
                    open={confirmationOpen}
                    onCancel={handleConfirmationCancel}
                    onConfirm={handleConfirmationConfirm}
                    content={`Are you sure you want to submit the weights? Wheat: ${wareHouseFormData.wheat}, Rice: ${wareHouseFormData.rice}, Sugar: ${wareHouseFormData.sugar}`}
                  />
                  <Modal
                    open={popupOpen}
                    onClose={handlePopupClose}
                  >
                    <Modal.Header>Shipment Status</Modal.Header>
                    <Modal.Content>
                      {approvalResult === 'approved' ? (
                        <p>The shipment has been approved.</p>
                      ) : approvalResult === 'rejected' ? (
                        <p>The shipment has been rejected.</p>
                      ) : null}
                    </Modal.Content>
                    <Modal.Actions>
                      <Button onClick={handlePopupClose}>Close</Button>
                    </Modal.Actions>
                  </Modal>
                </div>
              )}
            </Segment>
          </Segment.Group>


          <Segment.Group horizontal>
            <Segment className="form-segment" style={{ backgroundColor: '#ffffff', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
              <Header as="h3" textAlign="center" style={{ fontSize: '1.5em', marginBottom: '1em', color:"#83999a" }}>
                Transfer to Ration Shop
              </Header>
              <Form onSubmit={handleTransferToRationshop}>
                <Form.Field>
                  <label style={{ color: '#83999a' , textAlign: 'center' }}>Wheat</label>
                  <input
                    type="number"
                    name="wheat"
                    value={transferToRationShopFormData.wheat}
                    onChange={handleTransferChange}
                    style={{ fontSize: '1.3em', marginBottom: '1em', textAlign: 'center' }}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ color: '#83999a', textAlign: 'center'  }}>Rice</label>
                  <input
                    type="number"
                    name="rice"
                    value={transferToRationShopFormData.rice}
                    onChange={handleTransferChange}
                    style={{ fontSize: '1.3em', marginBottom: '1em', textAlign: 'center'  }}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ color: '#83999a', textAlign: 'center'  }}>Sugar</label>
                  <input
                    type="number"
                    name="sugar"
                    value={transferToRationShopFormData.sugar}
                    onChange={handleTransferChange}
                    style={{ fontSize: '1.3em', marginBottom: '1em', textAlign: 'center'  }}
                  />
                </Form.Field>
                <Button type="submit" color="teal" style={{ fontSize: '1.3em' }}>Submit</Button>
              </Form>
            </Segment>
          </Segment.Group>

          <div style={{ marginTop: '2em', textAlign: 'center' }}>
            <Button color="teal" onClick={handleViewCompleteShipmentSummary} style={{ fontSize: '1.3em' }}>View Complete Shipment Summary</Button>
          </div>
          
        </Grid.Column>
      </Grid>

    </div>
  );
};

export default DashboardPage;
