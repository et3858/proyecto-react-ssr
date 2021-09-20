import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-purple-500 text-white">
            <nav className="p-2 flex justify-between items-center">
                <Link to="/" className="text-xl">Home</Link>

                <div className="flex space-x-4">
                    <Link to="/about">About</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
