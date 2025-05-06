import {useState, useRef, useEffect} from 'react';
import {FaChevronDown, FaPlus,} from 'react-icons/fa';
import {Link} from "react-router-dom";
import {createPortal} from "react-dom";
import BoardCreateModel from "../BoardCreateModal.jsx";

export default function NavbarMenu() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center">
            {/* Desktop */}
            <div className="hidden lg:flex gap-4 text-sm text-gray-600">
                <span className="cursor-pointer hover:text-black flex items-center gap-2 text-gray-600 font-semibold text-md">
                  Workspaces <FaChevronDown/>
                </span>
                <Link to={'/coming-soon'}
                            className="cursor-pointer hover:text-black flex items-center gap-2 text-gray-600 font-semibold text-md">
                  Recent <FaChevronDown/>
                </Link>
                <Link to={'/messenger'}
                            className="cursor-pointer hover:text-black flex items-center gap-2 text-gray-600 font-semibold text-md">
                  Messenger <FaChevronDown/>
                </Link>
                <Link to={'/coming-soon'}
                            className="cursor-pointer hover:text-black flex items-center gap-2 text-gray-600 font-semibold text-md">
                  Templates <FaChevronDown/>
                </Link>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Create
                </button>
            </div>

            {/* Mobile */}
            <div className="lg:hidden relative flex" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-gray-400 px-2 py-1.5 rounded-md font-semibold text-md flex justify-center items-center gap-2"
                >
                    More <FaChevronDown className="h-2 w-2 font-bold"/>
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-gray-400 px-2.5 rounded-md font-semibold text-md flex justify-center items-center ms-3
                       bg-gray-300
                    "
                >
                    <FaPlus className={'text-white'}/>
                </button>


                {showDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                        <div className="flex flex-col text-gray-700 text-sm font-medium p-2 gap-2">
                              <span className="cursor-pointer hover:bg-gray-100 flex items-center gap-2">
                                Workspaces
                              </span>
                                <span className="cursor-pointer hover:bg-gray-100 flex items-center gap-2">
                                Recent
                              </span>
                              <Link to={'/messenger'} className="cursor-pointer hover:bg-gray-100 flex items-center gap-2">
                                Messenger
                              </Link>
                              <span className="cursor-pointer hover:bg-gray-100 flex items-center gap-2">
                                Templates
                              </span>
                        </div>
                    </div>
                )}
            </div>
            {createPortal(
                <BoardCreateModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>,
                document.body
            )}
        </div>
    );
}
