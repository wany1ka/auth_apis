import React, { useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Legend, Tooltip } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';

// Registering necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Legend, Tooltip);

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

    const calculateProfitAndLoss = () => {
        const totalSales = sales.reduce((total, sale) => total + sale.price * sale.quantity, 0);
        const totalInventoryCost = inventoryItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const profit = totalSales - totalInventoryCost;
        const loss = totalInventoryCost - totalSales;

        return {
            profit,
            loss
        };
    };

    const profitAndLossData = {
        labels: ['Profit', 'Loss'],
        datasets: [
            {
                label: 'Profit and Loss',
                data: [calculateProfitAndLoss().profit, calculateProfitAndLoss().loss],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }
        ]
    };

    const stockData = {
        labels: inventoryItems.map(item => item.name),
        datasets: [
            {
                label: 'Stock Items',
                data: inventoryItems.map(item => item.quantity),
                backgroundColor: inventoryItems.map((item, index) => `hsl(${(index / inventoryItems.length) * 360}, 100%, 75%)`),
                hoverBackgroundColor: inventoryItems.map((item, index) => `hsl(${(index / inventoryItems.length) * 360}, 100%, 60%)`)
            }
        ]
    };

    const salesData = {
        labels: sales.map(sale => sale.date),
        datasets: [
            {
                label: 'Sales',
                data: sales.map(sale => sale.price * sale.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const salesOptions = {
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sales Amount'
                }
            }
        },
        maintainAspectRatio: false, // Allow chart to resize based on container
        responsive: true // Ensure responsiveness
    };

    const pieOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
            }
        },
        maintainAspectRatio: false, // Allow chart to resize based on container
        responsive: true // Ensure responsiveness
    };

    return (
        <div className="sales-trends-container p-4">
            <h2 className="font-bold text-2xl mb-4">Sales Trends</h2>
            <div className="chart-container mb-20" style={{ height: '390px', width: '800px' }}>
                <h3 className="font-bold text-xl mb-2">Sales Over Time</h3>
                <Bar data={salesData} options={salesOptions} />
            </div>
            <div className="chart-container mb-20" style={{ height: '350px', width: '800px' }}>
                <h3 className="font-bold text-xl mb-2 mt-6 text-center">Profit and Loss</h3>
                <Pie data={profitAndLossData} options={pieOptions} />
            </div>
            <div className="chart-container" style={{ height: '350px', width: '800px' }}>
                <h3 className="font-bold text-xl mb-2 text-center">Stock Items</h3>
                <Pie data={stockData} options={pieOptions} />
            </div>
        </div>
    );
};

export default SalesTrends;
