import React, { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import pdsinstance from '../ethereum/pdsinstance';

const SupplyChainPage = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetchDataFromContract();
  }, []);

  const fetchDataFromContract = async () => {
    try {
      const summaryCount = await pdsinstance.methods.getSummaryCount().call();
      const summaryData = [];

      for (let i = 0; i < summaryCount; i++) {
        const item = await pdsinstance.methods.Summary(i).call();
        summaryData.push(item);
      }

      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching summary data from contract:', error);
    }
  };

  return (
    <div className="supply-chain">
        <h1 style={{ color: '#1a2a6c', marginTop: '2em', marginBottom: '2em' }}>Supply Chain Information</h1>
      <Table celled striped selectable>
        <Table.Header>
          <Table.Row>
          <Table.HeaderCell style={{ backgroundColor: '#e3f1f2', color: '#667778' }}>ID</Table.HeaderCell>
  <Table.HeaderCell style={{ backgroundColor: '#e3f1f2', color: '#667778' }}>Wheat</Table.HeaderCell>
  <Table.HeaderCell style={{ backgroundColor: '#e3f1f2', color: '#667778' }}>Rice</Table.HeaderCell>
  <Table.HeaderCell style={{ backgroundColor: '#e3f1f2', color: '#667778' }}>Sugar</Table.HeaderCell>
  <Table.HeaderCell style={{ backgroundColor: '#e3f1f2', color: '#667778' }}>From</Table.HeaderCell>
  <Table.HeaderCell style={{ backgroundColor: '#e3f1f2', color: '#667778' }}>To</Table.HeaderCell>
  <Table.HeaderCell style={{ backgroundColor: '#e3f1f2', color: '#667778' }}>Status</Table.HeaderCell>

          </Table.Row>
        </Table.Header>
        <Table.Body>
          {summary.map((item, index) => (
            <Table.Row
              key={index}
              style={{
                backgroundColor: item.status === 'Approved' ? '#bce8d3' : item.status === 'Rejected' ? '#e3a8a8' : 'inherit',
                color: item.status === 'Approved' || item.status === 'Rejected' ? '#000000' : 'inherit'
              }}
            >
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.wheat}</Table.Cell>
              <Table.Cell>{item.rice}</Table.Cell>
              <Table.Cell>{item.sugar}</Table.Cell>
              <Table.Cell>{item.from}</Table.Cell>
              <Table.Cell>{item.to}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default SupplyChainPage;
