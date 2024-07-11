import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import './App.css';
import Inventory from './components/Inventory';
import Register from "./components/Register";
import Navbar from './components/navbar';
import ErrorPage from "./components/Error-page";
import SalesTrends from "./components/SalesTrends";
import AddInventory from "./components/AddInventory";
import Sales from "./components/Sales";
import Home from "./components/Home";
import ContactForm from "./components/ContactForm";
import Login from "./components/Login";

const App = () => {
  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<AddInventory />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sales-trends" element={<SalesTrends />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </Router>
  );
}

export default App;
