import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/accounts/api/contact/', formData);
            console.log('Message sent:', response.data);
            setMessage('Message sent successfully!');
            setFormData({
                name: '',
                email: '',
                message: ''
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setMessage('Error sending message.');
        }
    };

    return (
        <div>
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Message:</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ContactForm;
