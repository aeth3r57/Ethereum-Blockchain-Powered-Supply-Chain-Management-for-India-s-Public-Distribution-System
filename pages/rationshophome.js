import React, { useState, useEffect } from 'react';
import { Grid, Header, Segment, Form, Button, Confirm, Modal } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import pdsinstance from '../ethereum/pdsinstance';

const DashboardPage = () => {
  const [structData, setStructData] = useState({});
  const [rationShopFormData, setRationShopFormData] = useState({ wheat: '', rice: '', sugar: '' });
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
      const data = await pdsinstance.methods.rationshop().call();
      setStructData(data);
      
      // Fetch pending approvals
      const pendingApprovals = await pdsinstance.methods.getarrRSapproval().call();
      setApprovalRequests(pendingApprovals);
    } catch (error) {
      console.error('Error fetching data from contract:', error);
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setRationShopFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const currentApproval = approvalRequests[currentApprovalIndex];

  const handleApproveOrReject = async () => {
    const connected_account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
      const { wheat, rice, sugar } = rationShopFormData;
      if (
        currentApproval &&
        currentApproval.wheat === wheat &&
        currentApproval.rice === rice &&
        currentApproval.sugar === sugar
      ) {
        // Approve the transfer
        await pdsinstance.methods.approveTransferToRationShop(currentApproval.id).send({ 
          from: connected_account[0],
          chainId: 5777,
          gasPrice: 100000000000,
          gas: 3000000
        });
        setApprovalResult('approved');
      } else {
        // Reject the transfer
        await pdsinstance.methods.rejectTransferToRationShop(currentApproval.id).send({ 
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
      setRationShopFormData({ wheat: '', rice: '', sugar: '' });
      setPopupOpen(true);
    } catch (error) {
      console.error('Error approving or rejecting transfer:', error);
      setApprovalResult(null);
    }
  };

  const handleNextApproval = () => {
    setCurrentApprovalIndex((prevIndex) => (prevIndex + 1) % approvalRequests.length);
  };

  const handlePreviousApproval = () => {
    setCurrentApprovalIndex((prevIndex) => (prevIndex - 1 + approvalRequests.length) % approvalRequests.length);
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

  const handlePopupClose = () => {
    setPopupOpen(false);
    setApprovalResult(null);
  };

  return (
    <div className="dashboard" style={{ backgroundColor: '#effafa' }}>
      <Grid textAlign="center" style={{ height: '100vh', margin: 0 }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 1000 }}>
          <Header as="h1" textAlign="center" style={{ marginTop: '1em', marginBottom: '2em', color:"#667778"}}>
            Ration Shop Home
          </Header>
          <Segment.Group horizontal> {/* Horizontal segments for left and right halves */}
            <Segment className="stock-segment" style={{ backgroundColor: '#a2bebf', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}> {/* Left half for displaying stock information */}
              <Header as="h3" textAlign="center" className="stock-header" style={{ fontSize: '1.5em', marginBottom: '1em', color:"#3d4748" }}>
                Ration Shop Stock
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
                        value={rationShopFormData.wheat}
                        onChange={handleChange}
                        style={{ fontSize: '1.3em', marginBottom: '1em', textAlign: 'center' }}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label style={{ color: '#83999a', textAlign: 'center' }}>Rice</label>
                      <input
                        type="number"
                        name="rice"
                        value={rationShopFormData.rice}
                        onChange={handleChange}
                        style={{ fontSize: '1.3em', marginBottom: '1em', textAlign: 'center' }}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label style={{ color: '#83999a', textAlign: 'center' }}>Sugar</label>
                      <input
                        type="number"
                        name="sugar"
                        value={rationShopFormData.sugar}
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
                    content={`Are you sure you want to submit the weights? Wheat: ${rationShopFormData.wheat}, Rice: ${rationShopFormData.rice}, Sugar: ${rationShopFormData.sugar}`}
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
          
          <div style={{ marginTop: '2em', textAlign: 'center' }}>
            <Button color="teal" onClick={handleViewCompleteShipmentSummary} style={{ fontSize: '1.3em' }}>View Complete Shipment Summary</Button>
          </div>
        </Grid.Column>
      </Grid>
    </div>
  );
};


export default DashboardPage;
