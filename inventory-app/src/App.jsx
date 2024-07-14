import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import './App.css';
import Inventory from './components/Inventory';
import Register from "./components/Register";
import Navbar from './components/navbar';
import ErrorPage from "./components/Error-page";
import SalesTrends from "./components/SalesTrends";
import AddInventory from "./components/AddInventory";
import Sales from "./components/Sales";
import ContactForm from "./components/ContactForm";
import Login from "./components/Login";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import ManagerDashboard from "./components/dashboards/ManagerDashboard";
import EmployeeDashboard from "./components/dashboards/EmployeeDashboard";

const App = () => {
    const [role, setRole] = useState(localStorage.getItem('role'));

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    return (
        <Router>
            <Navbar role={role} />
            <Routes>
                <Route path="/" element={<Inventory />} />
                <Route path="/add" element={<AddInventory />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setRole={setRole} />} />
                <Route path="/sales-trends" element={<SalesTrends />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/contact" element={<ContactForm />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
};

export default App;