import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [formData, setFormData] = useState({
        item: '',
        quantity: 0,
        price: 0.0,
        date: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSales();
        fetchInventoryItems();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/accounts/api/sales/');
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const fetchInventoryItems = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/accounts/api/inventory/');
            setInventoryItems(response.data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/accounts/api/sales/', formData);
            console.log('Sale recorded:', response.data);
            fetchSales(); // Refresh the sales list after recording a sale
            setFormData({
                item: '',
                quantity: 0,
                price: 0.0,
                date: ''
            });
            setMessage('Sale recorded successfully!');
        } catch (error) {
            console.error('Error recording sale:', error);
            setMessage('Error recording sale.');
        }
    };

    return (
        <div className="sales-container">
            <h2 className="font-bold text-lg">Sales Management</h2>
            <form onSubmit={handleSubmit} className="sales-form">
                <div className="form-group">
                    <label>Item:</label>
                    <select name="item" value={formData.item} onChange={handleChange} required>
                        <option value="">Select an item</option>
                        {inventoryItems.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <button type="submit" className="bg-blue-500 p-2 mb-5">Record Sale</button>
            </form>
            {message && <p>{message}</p>}
            <h3 className="font-bold text-md mt-4">Sales List</h3>
            <ul className="sales-list">
                {sales.map((sale) => (
                    <li key={sale.id} className="sales-item">
                        <div className="sales-item-details">
                            <strong>{sale.item.name}</strong> - Quantity: {sale.quantity}, Price: ${sale.price}, Date: {sale.date}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sales;
