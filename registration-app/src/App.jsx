import React from 'react';
import './App.css';
import Register from './Register';
import Inventory from './Inventory';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Inventory Management System</h1>
      </header>
      <main>
        <div className="container">
          <Register />
          <Inventory />
        </div>
      </main>
    </div>
  );
}

export default App;
