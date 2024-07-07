import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import '../styles/SalesTrends.css';

const SalesTrends = () => {
    const [sales, setSales] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);

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

    const calculateTrends = () => {
        // Placeholder for trend calculation logic
        return {
            labels: sales.map(sale => sale.date),
            data: sales.map(sale => sale.quantity),
        };
    };

    const trends = calculateTrends();

    const barData = {
        labels: trends.labels,
        datasets: [
            {
                label: 'Sales Quantity',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: trends.data,
            },
        ],
    };

    const pieData = {
        labels: ['Profit', 'Loss', 'Stock'],
        datasets: [
            {
                label: 'Sales Trends',
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                data: [65, 59, 80], // Placeholder data
            },
        ],
    };

    return (
        <div className="sales-trends-container p-4">
            <h2 className="font-bold text-2xl mb-4">Sales Trends</h2>
            <div className="bar-chart mb-4">
                <Bar
                    data={barData}
                    options={{
                        title: {
                            display: true,
                            text: 'Sales Quantity Over Time',
                            fontSize: 20,
                        },
                        legend: {
                            display: true,
                            position: 'right',
                        },
                    }}
                />
            </div>
            <div className="pie-chart">
                <Pie
                    data={pieData}
                    options={{
                        title: {
                            display: true,
                            text: 'Profit, Loss, and Stock',
                            fontSize: 20,
                        },
                        legend: {
                            display: true,
                            position: 'right',
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default SalesTrends;
