import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Inventory.css';

const Inventory = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        price_min: null,
        price_max: null,
        stock_min: null,
        stock_max: null,
    });
    const [sortParams, setSortParams] = useState({
        sortBy: 'name',
        sortOrder: 'asc',
    });

    useEffect(() => {
        fetchInventoryItems();
    }, [filters, sortParams]); // Update inventory items when filters or sorting parameters change

    const fetchInventoryItems = async () => {
        try {
            const filteredParams = {};
            for (const key in filters) {
                if (filters[key] !== '' && filters[key] !== null) {
                    filteredParams[key] = filters[key];
                }
            }
            filteredParams['ordering'] = `${sortParams.sortOrder === 'desc' ? '-' : ''}${sortParams.sortBy}`;

            const response = await axios.get('http://127.0.0.1:8000/accounts/api/inventory/', {
                params: filteredParams,
            });
            setInventoryItems(response.data);
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/accounts/api/inventory/${id}/`);
                console.log('Item deleted:', id);
                fetchInventoryItems(); // Refresh the inventory list after deleting an item
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSortChange = (e) => {
        setSortParams({
            ...sortParams,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="inventory-container">
            <h2 className="font-bold text-lg">Inventory Management</h2>

            <div className="filters-sort-container">
                <div className="filters bg-gray-200 p-4 rounded-md mb-4 mr-4 flex">
                    <label className="block mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        className="border-gray-300 border rounded-lg p-0 flex-none mr-1 mb-1"
                    />  

                    <label className="block mb-2">Price Range:</label>
                    <div className="block mb-2">
                        <input
                            type="number"
                            name="price_min"
                            value={filters.price_min || ''}
                            onChange={handleFilterChange}
                            placeholder="Min"
                            className="border-gray-300 border p-1 rounded-lg flex-1 mr-1 mb-1"
                        />
                        <input
                            type="number"
                            name="price_max"
                            value={filters.price_max || ''}
                            onChange={handleFilterChange}
                            placeholder="Max"
                            className="border-gray-300 border p-1 rounded-lg flex-1 mr-1 mb-1"
                        />
                    </div> 

                    <label className="block mb-2">Stock Range:</label>
                    <div className="block mb-2">
                        <input
                            type="number"
                            name="stock_min"
                            value={filters.stock_min || ''}
                            onChange={handleFilterChange}
                            placeholder="Min"
                            className="border-gray-300 border p-1 rounded-lg flex-1 mr-1 mb-1"
                        />
                        <input
                            type="number"
                            name="stock_max"
                            value={filters.stock_max || ''}
                            onChange={handleFilterChange}
                            placeholder="Max"
                            className="border-gray-300 border p-1 rounded-lg flex-1 mr-1 "
                        />
                    </div>

                    <button
                        onClick={fetchInventoryItems}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Apply Filters
                    </button>
                </div>

                <div className="sort bg-gray-200 p-4 rounded-md mb-4 flex">
                    <label className="block mb-2">Sort By:</label>
                    <select
                        name="sortBy"
                        value={sortParams.sortBy}
                        onChange={handleSortChange}
                        className="border-gray-300 border p-1 rounded-lg pr-4 mr-1 "
                    >
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="quantity">Quantity</option>
                    </select>

                    <label className="block ml-2">Sort Order:</label>
                    <select
                        name="sortOrder"
                        value={sortParams.sortOrder}
                        onChange={handleSortChange}
                        className="border-gray-300 border p-1 rounded-lg pr-3 mr-1 mb-1"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            <ul className="inventory-list">
                {inventoryItems.map((item) => (
                    <li key={item.id} className="inventory-item">
                        <div className="inventory-item-details">
                            <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ${item.price}
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-300">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inventory;
