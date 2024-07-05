import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AddInventory.css';

const AddInventory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });

  const [success, setSuccess] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/api/inventory/', formData);
      console.log('Item created:', response.data);
      setSuccess(true);

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


  return (
    <div className="inventory-container">
      <h2 className='font-bold text-lg'>Inventory Management</h2>
      {success ? (
        <p>Addition successful!</p>
      ) : (
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
      )}
    </div>
  );
};
export default AddInventory;