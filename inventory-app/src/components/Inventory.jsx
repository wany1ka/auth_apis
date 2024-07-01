// src/Inventory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Inventory.css'

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/accounts/api/inventory/');
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/api/inventory/', formData);
      console.log('Item created:', response.data);
      fetchInventoryItems(); // Refresh the inventory list after creating an item
      setFormData({
        name: '',
        description: '',
        quantity: 0,
        price: 0,
      });
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/accounts/api/inventory/bulk/`);
      console.log('Item deleted:', id);
      fetchInventoryItems(); // Refresh the inventory list after deleting an item
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="inventory-container">
    <h2 className='font-bold text-lg'>Inventory Management</h2>
    <form onSubmit={handleSubmit} className="inventory-form">
      <div className="form-group">
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Quantity:</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      </div>
      <button type="submit" className='bg-blue-500 p-2 mb-5'>Add Item</button>
    </form>
    <ul className="inventory-list">
      {inventoryItems.map((item) => (
        <li key={item.id} className="inventory-item">
          <div className="inventory-item-details">
            <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ${item.price}
          </div>
          <button onClick={() => handleDelete(item.id)} className='px-2 py-1'>Delete</button>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default Inventory;
