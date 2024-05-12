import React, { useState, useEffect } from 'react';
import { Container, Header, Card, Image, Loader, Segment, Form, Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import pdsinstance from '../ethereum/pdsinstance';
import Web3 from 'web3'; // Import Web3 library

const cardInfoArray = [
  {
    cardType: "PHH",
    cardDescription: "Priority House Hold",
    wheat: "5 Kgs per card @ Rs.7.50 per Kg",
    rice: "4 kgs per adult and 2 Kgs per adult",
    sugar: "500 gms per head @ Rs.25 per Kg"
  },
  {
    cardType: "PHH-AAY",
    cardDescription: "Priority House Hold – Antyodaya Anna Yojana",
    wheat: "5 Kgs per card @ Rs.7.50 per Kg",
    rice: "35 Kgs (Free)",
    sugar: "500 gms per head @ Rs.13.50 per Kg"
  },
  {
    cardType: "NPHH",
    cardDescription: "Non-Priority House Hold",
    wheat: "5 Kgs per card @ Rs.7.50 per Kg",
    rice: "4 kgs per adult and 2 Kgs per adult",
    sugar: "500 gms per head @ Rs.25 per Kg"
  },
  {
    cardType: "NPHH-S",
    cardDescription: "Non-Priority House Hold - Sugar Only",
    wheat: "5 Kgs per card @ Rs.7.50 per Kg",
    rice: "Not Applicable",
    sugar: "500 gms per head @ Rs.25 per Kg plus 3 Kgs of Sugar"
  }
];

const ProductCard = ({ name, image, stock }) => (
  <Card>
    <Image src={image} wrapped ui={false} />
    <Card.Content>
      <Card.Header>{name}</Card.Header>
      <Card.Description>Stock: {stock}</Card.Description>
    </Card.Content>
  </Card>
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ cardType: '', numberOfAdults: '', numberOfChildren: '' });
  const [web3, setWeb3] = useState(null); // State to hold the Web3 instance
  const [selectedCardInfo, setSelectedCardInfo] = useState(null); // State to hold the selected card information

  useEffect(() => {
    loadWeb3();
    fetchData();
  }, []);

  const loadWeb3 = async () => {
    // Check if Web3 provider is injected by MetaMask
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWeb3(web3Instance);
      } catch (error) {
        console.error('User denied account access:', error);
      }
    } else {
      console.error('No Ethereum provider detected. Please install MetaMask.');
    }
  };


  const fetchData = async () => {
    try {
      const { wheat, rice, sugar } = await pdsinstance.methods.rationshop().call();
      const products = [
        { name: 'Wheat', image: 'https://i.ibb.co/tMH0J1b/fresh-wheat-crop.jpg', stock: wheat },
        { name: 'Rice', image: 'https://www.hindustantimes.com/ht-img/img/2023/05/13/550x309/parboiled_rice_1683969590180_1683969607293.jpg', stock: rice },
        { name: 'Sugar', image: 'https://i.ibb.co/56bJFZL/sugar-cubes.jpg', stock: sugar }
      ];
      setProducts(products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data from contract:', error);
      setLoading(false);
    }
  };

  const handleFormChange = (event, { name, value }) => {
    setFormData({ ...formData, [name]: value });
    // Find the selected card information from cardInfoArray
    const selectedCard = cardInfoArray.find(card => card.cardType === value);
    setSelectedCardInfo(selectedCard);
  };



  const handleSubmit = async () => {
    const connected_account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
      const { cardType, numberOfAdults, numberOfChildren } = formData;
      if (!web3) {
        console.error('Web3 instance not initialized.');
        return;
      }
      // Call the contract function
      const result = await pdsinstance.methods.reduceStock(cardType, numberOfAdults, numberOfChildren).send({ 
        from: connected_account[0],
        chainId: 5777,
        gasPrice: 100000000000,
        gas: 3000000
      }); // Replace YOUR_ADDRESS with your Ethereum address

      const totalpricepaise = await pdsinstance.methods.reduceStock(cardType, numberOfAdults, numberOfChildren).call({ 
        from: connected_account[0],
        chainId: 5777,
        gasPrice: 100000000000,
        gas: 3000000
      });

      const totalpricerup=Math.ceil(totalpricepaise/100 );
      console.log(totalpricerup);
      
      const totalweiprice = web3.utils.toWei((totalpricerup).toString(), 'ether');

      await pdsinstance.methods.paymoney(totalweiprice).send({ 
        from: connected_account[0],
        chainId: 5777,
        gasPrice: 100000000000,
        gas: 3000000,
        //value: web3.utils.toWei((totalpricerup * 1.1).toString(), 'ether')
        value: 1.1 * totalweiprice
      });
      fetchData();
      // Refresh data or update UI as needed
    } catch (error) {
      console.error('Error calling contract function:', error);
    }
  };
  

  const handleLogout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('accessToken');
    window.location.href = '/'; 

  };

  return (
    <Container>
      <Header as="h1" textAlign="center">Customer Interface</Header>
      <Header as="h3" >Stock</Header>
      <Segment loading={loading}>
        <Card.Group itemsPerRow={3}>
          {products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              image={product.image}
              stock={product.stock}
            />
          ))}
        </Card.Group>
      </Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths='equal'>
          <Form.Field
            control={Dropdown}
            label='Card Type'
            name='cardType'
            options={[
              { key: 'PHH', text: 'PHH', value: 'PHH' },
              { key: 'PHH-AAY', text: 'PHH-AAY', value: 'PHH-AAY' },
              { key: 'NPHH', text: 'NPHH', value: 'NPHH' },
              { key: 'NPHH-S', text: 'NPHH-S', value: 'NPHH-S' }
            ]}
            placeholder='Select Card Type'
            onChange={handleFormChange}
            value={formData.cardType}
          />
          <Form.Input
            label='Number of Adults'
            name='numberOfAdults'
            type='number'
            onChange={handleFormChange}
            value={formData.numberOfAdults}
          />
          <Form.Input
            label='Number of Children'
            name='numberOfChildren'
            type='number'
            onChange={handleFormChange}
            value={formData.numberOfChildren}
          />
        </Form.Group>
        <Form.Button>Submit</Form.Button>
      </Form>

      {selectedCardInfo && (
        <Segment>
          <Header as="h3">Selected Card Information</Header>
          <p><strong>Card Type:</strong> {selectedCardInfo.cardType}</p>
          <p><strong>Card Description:</strong> {selectedCardInfo.cardDescription}</p>
          <p><strong>Wheat:</strong> {selectedCardInfo.wheat}</p>
          <p><strong>Rice:</strong> {selectedCardInfo.rice}</p>
          <p><strong>Sugar:</strong> {selectedCardInfo.sugar}</p>
        </Segment>
      )}
    </Container>
  );
};

export default App;
