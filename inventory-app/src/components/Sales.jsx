import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Sales.css';

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
        <div className="sales-container p-4">
            <h2 className="font-bold text-2xl mb-4">Sales Management</h2>
            <form onSubmit={handleSubmit} className="sales-form bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="form-group mb-4">
                    <label className="block text-gray-700">Item:</label>
                    <select name="item" value={formData.item} onChange={handleChange} className="border-gray-300 border p-2 rounded-md w-full mt-2" required>
                        <option value="">Select an item</option>
                        {inventoryItems.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700">Quantity:</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="border-gray-300 border p-2 rounded-md w-full mt-2" required />
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700">Price:</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="border-gray-300 border p-2 rounded-md w-full mt-2" required />
                </div>
                <div className="form-group mb-4">
                    <label className="block text-gray-700">Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="border-gray-300 border p-2 rounded-md w-full mt-2" required />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Record Sale</button>
            </form>
            {message && <p className="text-green-500 mb-4">{message}</p>}
            <h3 className="font-bold text-xl mb-4">Sales List</h3>
            <ul className="sales-list bg-white shadow-md rounded-lg p-4">
                {sales.map((sale) => (
                    <li key={sale.id} className="sales-item mb-4 p-4 border-b border-gray-200">
                        <div className="sales-item-details">
                            <strong className="block text-lg">{sale.item.name}</strong>
                            <span className="block">Quantity: {sale.quantity}</span>
                            <span className="block">Price: ${sale.price}</span>
                            <span className="block">Date: {sale.date}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sales;
