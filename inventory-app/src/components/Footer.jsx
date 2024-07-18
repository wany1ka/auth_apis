// Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-200 py-4 mt-10">
            <div className="container mx-auto text-center py-7">
                <p>&copy; {new Date().getFullYear()} Wany1ka. All rights reserved.</p>

            </div>
        </footer>
    );
};

export default Footer;
