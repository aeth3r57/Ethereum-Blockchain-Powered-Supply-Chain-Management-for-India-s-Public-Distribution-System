import React, { useState, useEffect } from 'react';
import { Grid, Header, Segment, Form, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import pdsinstance from '../ethereum/pdsinstance';

const DashboardPage = () => {
  const [marketYardFormData, setMarketYardFormData] = useState({ wheat: '', rice: '', sugar: '' });
  const [transferToWarehouseFormData, setTransferToWarehouseFormData] = useState({ wheat: '', rice: '', sugar: '' });
  const [structData, setStructData] = useState({});

  useEffect(() => {
    fetchDataFromContract();
  }, []);

  const fetchDataFromContract = async () => {
    try {
      const data = await pdsinstance.methods.marketyard().call();
      setStructData(data);
    } catch (error) {
      console.error('Error fetching data from contract:', error);
    }
  };

  const handleMarketYardSubmit = async (event) => {
    event.preventDefault();
    const connected_account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
      await pdsinstance.methods.MYdeposit(marketYardFormData.wheat, marketYardFormData.rice, marketYardFormData.sugar).send(
        { 
          from: connected_account[0],
          chainId: 5777,
          gasPrice: 100000000000,
          gas:3000000
        }
      );
      await fetchDataFromContract();
      setMarketYardFormData({ wheat: '', rice: '', sugar: '' });
    } catch (error) {
      console.error('Error updating struct data:', error);
    }
  };

  const handleTransferToWarehouseSubmit = async (event) => {
    event.preventDefault();
    const connected_account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
      await pdsinstance.methods.requestTransferToWarehouse(transferToWarehouseFormData.wheat, transferToWarehouseFormData.rice, transferToWarehouseFormData.sugar).send(
        { 
          from: connected_account[0],
          chainId: 5777,
          gasPrice: 100000000000,
          gas:3000000
        }
      );
      await fetchDataFromContract();
      setTransferToWarehouseFormData({ wheat: '', rice: '', sugar: '' });
    } catch (error) {
      console.error('Error transferring to warehouse:', error);
    }
  };

  const handleMarketYardChange = (event) => {
    const { name, value } = event.target;
    setMarketYardFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTransferToWarehouseChange = (event) => {
    const { name, value } = event.target;
    setTransferToWarehouseFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleViewCompleteShipmentSummary = () => {
    // Redirect to a new website for viewing complete shipment summary
    window.location.href = 'http://localhost:3000/shipmentsummary';
  };

  return (
    <div className="dashboard" style={{ backgroundColor: '#effafa' }}>
      <Grid textAlign="center" style={{ height: '100vh', margin: 0 }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 1000 }}>
          <Header as="h1" textAlign="center" style={{ marginTop: '1em', marginBottom: '2em', color:"#667778"}}>
            Market Yard Home
          </Header>
          <Segment.Group horizontal> {/* Horizontal segments for left and right halves */}
            <Segment className="stock-segment" style={{ backgroundColor: '#a2bebf', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}> {/* Left half for displaying stock information */}
              <Header as="h3" textAlign="center" className="stock-header" style={{ fontSize: '1.5em', marginBottom: '1em', color:"#3d4748" }}>
                Market Yard Stock
              </Header>
              <div className="stock-details" style={{ marginTop: '1.5em', fontSize: '1.3em' }}>
                <p style={{ marginBottom: '1em' }}><span style={{ color: '#515f60' }}>WHEAT:</span> {structData.wheat}</p>
                <p style={{ marginBottom: '1em' }}><span style={{ color: '#515f60' }}>RICE:</span> {structData.rice}</p>
                <p><span style={{ color: '#515f60' }}>SUGAR:</span> {structData.sugar}</p>
              </div>
            </Segment>
            <Segment className="form-segment" style={{ backgroundColor: '#ffffff', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}> {/* Right half for the form */}
              <Header as="h3" textAlign="center" style={{ fontSize: '1.5em', marginBottom: '1em', color:"#83999a" }}>
                Add Stock to Market Yard
              </Header>
              <Form onSubmit={handleMarketYardSubmit}>
                <Form.Field>
                  <label style={{ color: '#83999a' }}>Wheat</label>
                  <input
                    type="text"
                    name="wheat"
                    value={marketYardFormData.wheat}
                    onChange={handleMarketYardChange}
                    style={{ fontSize: '1.3em', marginBottom: '1em' }}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ color: '#83999a' }}>Rice</label>
                  <input
                    type="text"
                    name="rice"
                    value={marketYardFormData.rice}
                    onChange={handleMarketYardChange}
                    style={{ fontSize: '1.3em', marginBottom: '1em' }}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ color: '#83999a' }}>Sugar</label>
                  <input
                    type="text"
                    name="sugar"
                    value={marketYardFormData.sugar}
                    onChange={handleMarketYardChange}
                    style={{ fontSize: '1.3em', marginBottom: '1em' }}
                  />
                </Form.Field>
                <Button type="submit" color="teal" style={{ fontSize: '1.3em' }}>Submit</Button>
              </Form>
            </Segment>
          </Segment.Group>
          <Segment.Group horizontal>
            <Segment className="form-segment" style={{ backgroundColor: '#ffffff', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
              <Header as="h3" textAlign="center" style={{ fontSize: '1.5em', marginBottom: '1em', color:"#83999a" }}>
                Transfer to Warehouse
              </Header>
              <Form onSubmit={handleTransferToWarehouseSubmit}>
                <Form.Field>
                  <label style={{ color: '#83999a' }}>Wheat</label>
                  <input
                    type="text"
                    name="wheat"
                    value={transferToWarehouseFormData.wheat}
                    onChange={handleTransferToWarehouseChange}
                    style={{ fontSize: '1.3em', marginBottom: '1em' }}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ color: '#83999a' }}>Rice</label>
                  <input
                    type="text"
                    name="rice"
                    value={transferToWarehouseFormData.rice}
                    onChange={handleTransferToWarehouseChange}
                    style={{ fontSize: '1.3em', marginBottom: '1em' }}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ color: '#83999a' }}>Sugar</label>
                  <input
                    type="text"
                    name="sugar"
                    value={transferToWarehouseFormData.sugar}
                    onChange={handleTransferToWarehouseChange}
                    style={{ fontSize: '1.3em', marginBottom: '1em' }}
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
