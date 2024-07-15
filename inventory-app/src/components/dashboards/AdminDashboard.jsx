// AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch user info using the access token
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('access');
            try {
                const response = await axios.get('http://127.0.0.1:8000/accounts/api/user-info/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        // Fetch users data using the access token
        const fetchUsers = async () => {
            const token = localStorage.getItem('access');
            try {
                const response = await axios.get('http://127.0.0.1:8000/accounts/api/users/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUserInfo();
        fetchUsers();
    }, []);

    return (
        <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
            <header className="admin-dashboard-header bg-white shadow p-6 mb-8 rounded-lg">
                <h1 className="text-3xl font-semibold mb-2">Welcome, {username}!</h1>
                <p className="text-gray-600">Welcome to the Admin Dashboard. Here you can manage users and perform administrative tasks.</p>
            </header>
            <section className="users-section bg-white shadow p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Users</h2>
                <table className="users-table min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Active</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th> */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                {/* <td className="px-6 py-4 whitespace-nowrap">{user.is_active ? 'Active' : 'Inactive'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(user.date_joined).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AdminDashboard;
