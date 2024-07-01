import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <nav className="bg-gray-800 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <li>
                    <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                </li>
                <ul className="flex justify-center space-x-4">

                    <li>
                        <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
                    </li>
                   
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;