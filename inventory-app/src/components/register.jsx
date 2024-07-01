// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '', // Add role to form data
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/api/users/', formData);
      if (response.status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      setError(error.response ? error.response.data : 'Error occurred');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {success ? (
        <p>Registration successful!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label>Role:</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} required />
          </div>
          {error && (
            <div className="error">
              {typeof error === 'string' ? (
                <p>{error}</p>
              ) : (
                Object.keys(error).map((key) => (
                  <p key={key}>{`${key}: ${error[key]}`}</p>
                ))
              )}
            </div>
          )}
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
};

export default Register;
