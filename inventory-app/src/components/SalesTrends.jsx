import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/SalesTrends.css';

const SalesTrends = () => {
    const [reportData, setReportData] = useState({
        total_sales_count: 0,
        total_revenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSalesTrendsReport();
    }, []);

    const fetchSalesTrendsReport = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/accounts/api/sales-trends-report/');
            setReportData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching sales trends report:', err);
            setError(err);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="sales-trends-container">
            <h2 className="font-bold text-lg">Sales Trends Report</h2>
            <div className="report-item">
                <strong>Total Sales Count:</strong> {reportData.total_sales_count}
            </div>
            <div className="report-item">
                <strong>Total Revenue:</strong> ${reportData.total_revenue}
            </div>
        </div>
    );
};

export default SalesTrends;
