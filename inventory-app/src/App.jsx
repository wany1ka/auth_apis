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

const App = () => {
  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<AddInventory />} />
      <Route path="/register" element={<Register />} />
      <Route path="/salesTrends" element={<SalesTrends />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </Router>
  );
}

export default App;
