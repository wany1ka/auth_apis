import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import '../styles/SalesTrends.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SalesTrends = ({ sales, inventory }) => {
    const [salesData, setSalesData] = useState({});
    const [profitData, setProfitData] = useState({});
    const [stockData, setStockData] = useState({});

    useEffect(() => {
        prepareChartData();
    }, [sales, inventory]);

    const prepareChartData = () => {
        if (sales.length === 0 || inventory.length === 0) {
            return;
        }

        const labels = sales.map(sale => sale.date);
        const salesAmounts = sales.map(sale => sale.price * sale.quantity);
        setSalesData({
            labels: labels,
            datasets: [
                {
                    label: 'Sales Trends',
                    data: salesAmounts,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                }
            ]
        });

        const totalProfit = sales.reduce((acc, sale) => acc + sale.price * sale.quantity, 0);
        const totalLosses = inventory.reduce((acc, item) => acc + item.price * item.quantity, 0) - totalProfit;
        setProfitData({
            labels: ['Profit', 'Losses'],
            datasets: [
                {
                    data: [totalProfit, totalLosses],
                    backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                }
            ]
        });

        const stockLabels = inventory.map(item => item.name);
        const stockQuantities = inventory.map(item => item.quantity);
        setStockData({
            labels: stockLabels,
            datasets: [
                {
                    label: 'Stock Quantities',
                    data: stockQuantities,
                    backgroundColor: stockLabels.map(() => getRandomColor()),
                }
            ]
        });
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className="sales-trends-container bg-white shadow-md rounded-lg p-4">
            <h3 className="font-bold text-xl mb-4">Sales Trends</h3>
            {salesData.labels ? (
                <Line data={salesData} />
            ) : (
                <p>No sales data available to display.</p>
            )}

            <h3 className="font-bold text-xl mt-8 mb-4">Profit and Losses</h3>
            {profitData.labels ? (
                <Pie data={profitData} />
            ) : (
                <p>No profit and losses data available to display.</p>
            )}

            <h3 className="font-bold text-xl mt-8 mb-4">Stock Quantities</h3>
            {stockData.labels ? (
                <Pie data={stockData} />
            ) : (
                <p>No stock data available to display.</p>
            )}
        </div>
    );
};

export default SalesTrends;
