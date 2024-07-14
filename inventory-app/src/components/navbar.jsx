import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ role }) => {
    return (
        <nav className=''>
            <ul className='flex m-5 bg-blue-400 p-4 text-gray-200'>
                {role === 'admin' && (
                    <>
                        <li className='text-black hover:text-gray-500 mr-3'><Link to="/admin-dashboard">Admin Dashboard</Link></li>
                        <li className='hover:text-gray-500 mr-3'><Link to="/inventory">Inventory</Link></li>
                        <li className='hover:text-gray-500 mr-3'><Link to="/sales">Sales</Link></li>
                        <li className='hover:text-gray-500 mr-3'><Link to="/sales-trends">Trends</Link></li>
                        <li className='hover:text-gray-500'><Link to="/register">Register</Link></li>
                    </>
                )}
                {role === 'manager' && (
                    <>
                        <li className='text-black hover:text-gray-500 mr-3'><Link to="/manager-dashboard">Manager Dashboard</Link></li>
                        <li className='hover:text-gray-500 mr-3'><Link to="/inventory">Inventory</Link></li>
                        <li className='hover:text-gray-500 mr-3'><Link to="/sales-trends">Trends</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
                {role === 'employee' && (
                    <>
                        <li className='text-black hover:text-gray-500 mr-3'><Link to="/employee-dashboard">Employee Dashboard</Link></li>
                        <li className='hover:text-gray-500 mr-3'><Link to="/sales">Sales</Link></li>
                        <li className='hover:text-gray-500 mr-3'><Link to="/contact">Contact</Link></li>
                    </>
                )}
                {!role && (
                    <>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;