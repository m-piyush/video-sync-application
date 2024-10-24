import { FaCamera } from "react-icons/fa";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="relative h-[6vh] shadow-lg">
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-6 py-1 h-[50px]">
                <div className="flex items-center gap-4 text-2xl font-bold text-white">
                    <FaCamera className="text-3xl" />
                    <h3 className="tracking-wide">Video App</h3>
                </div>


                <nav className="hidden sm:flex items-center gap-8 font-medium">
                    <a href="#home" className="text-white hover:text-yellow-300 transition-colors duration-300" > Home </a>
                    <a
                        href="#contact"
                        className="text-white hover:text-yellow-300 transition-colors duration-300"
                    >
                        Contact
                    </a>
                    <a
                        href="#about"
                        className="text-white hover:text-yellow-300 transition-colors duration-300"
                    >
                        About
                    </a>
                </nav>

                {/* Hamburger Menu (Mobile) */}
                <div className="sm:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                        {isOpen ? (
                            <FaTimes className="text-3xl" />
                        ) : (
                            <FaBars className="text-3xl" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isOpen && (
                <div className="sm:hidden absolute top-full left-0 w-full bg-gradient-to-b from-purple-500 to-pink-500 shadow-md z-50">
                    <nav className="flex flex-col items-center space-y-4 py-4">
                        <a
                            href="#home"
                            className="text-white font-medium hover:text-yellow-300 transition-colors duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </a>
                        <a
                            href="#contact"
                            className="text-white font-medium hover:text-yellow-300 transition-colors duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact
                        </a>
                        <a
                            href="#about"
                            className="text-white font-medium hover:text-yellow-300 transition-colors duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            About
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
