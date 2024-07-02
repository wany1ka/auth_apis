import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import './App.css';
import Inventory from './components/Inventory';
import Register from "./components/Register";
import Navbar from './components/navbar';
import ErrorPage from "./components/Error-page";

const App = () => {
  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Inventory />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<ErrorPage />} />
 
    </Routes>
  </Router>
  );
}

export default App;
