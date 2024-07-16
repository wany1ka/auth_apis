// ContactMessages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:8000/accounts/api/contact/');
                // Sort messages by created_at in descending order (newest first)
                const sortedMessages = response.data.sort((a, b) => {
                    if (a.created_at > b.created_at) return -1;
                    if (a.created_at < b.created_at) return 1;
                    return 0;
                });
                setMessages(sortedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
            <ul className="divide-y divide-gray-300">
                {messages.map(message => (
                    <li key={message.id} className="py-4">
                        <div className="space-y-2">
                            <div>
                                <strong className="font-semibold">Name:</strong> {message.name}
                            </div>
                            <div>
                                <strong className="font-semibold">Email:</strong> {message.email}
                            </div>
                            <div>
                                <strong className="font-semibold">Phone:</strong> {message.phone}
                            </div>
                            <div>
                                <strong className="font-semibold">Message:</strong> {message.message}
                            </div>
                            <div className="text-sm text-gray-500">
                                Sent at: {new Date(message.created_at).toLocaleString()}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactMessages;
