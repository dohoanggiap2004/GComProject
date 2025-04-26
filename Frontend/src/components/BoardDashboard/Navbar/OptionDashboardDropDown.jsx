import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const OptionDashboardDropDown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { board } = useSelector((state) => state.board);

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-400 text-white text-sm font-semibold py-1 px-4 rounded-md flex items-center gap-2"
            >
                Dashboard
                <FiChevronDown className="text-white" />
            </button>

            {isOpen && (
                <div className="absolute mt-1 w-full z-20 rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                            <Link to={`/user-workspace/board/${board?._id}`}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Board
                            </Link>
                        </li>
                        <li>
                            <Link to={`/user-workspace/board/dashboard/${board?._id}`}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OptionDashboardDropDown;
