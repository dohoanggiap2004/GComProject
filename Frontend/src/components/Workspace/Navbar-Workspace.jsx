import {FaChevronDown, FaPlus} from 'react-icons/fa';
import {IoIosSearch, IoIosNotifications, IoIosHelpCircle,} from "react-icons/io";
import {Link} from "react-router-dom";
import {BsGrid1X2Fill} from "react-icons/bs";
import AvatarDropdown from "../Dropdown/AvatarDropdown.jsx";
import {useEffect, useState} from "react";
import BoardCreateModel from "./BoardCreateModal.jsx";
import {createPortal} from "react-dom";

export default function NavbarWorkspace() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto'; // Cleanup
        };
    }, [isModalOpen]);

    return (

        <nav className="flex items-center justify-between bg-white p-1.5 shadow-md w-full">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <div className="font-bold text-lg flex items-center gap-2">
                    {/*dot svg*/}
                    <Link to={'/'}>
                        <svg viewBox="0 0 24 24" className={'h-6 w-6'} version="1.1"
                             xmlns="http://www.w3.org/2000/svg"
                             fill="#000000">
                            <g id="SVGRepo_bgCarrier"></g>
                            <g id="SVGRepo_tracerCarrier"></g>
                            <g id="SVGRepo_iconCarrier"><title>dot_grid_fill</title>
                                <g id="页面-1" stroke="none" fill="none">
                                    <g id="System" transform="translate(-528.000000, -336.000000)">
                                        <g id="dot_grid_fill" transform="translate(528.000000, 336.000000)">
                                            <path
                                                d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                                                id="MingCute"></path>
                                            <path
                                                d="M5.5,16.5 C6.60457,16.5 7.5,17.3954 7.5,18.5 C7.5,19.6046 6.60457,20.5 5.5,20.5 C4.39543,20.5 3.5,19.6046 3.5,18.5 C3.5,17.3954 4.39543,16.5 5.5,16.5 Z M12,16.5 C13.1046,16.5 14,17.3954 14,18.5 C14,19.6046 13.1046,20.5 12,20.5 C10.8954,20.5 10,19.6046 10,18.5 C10,17.3954 10.8954,16.5 12,16.5 Z M18.5,16.5 C19.6046,16.5 20.5,17.3954 20.5,18.5 C20.5,19.6046 19.6046,20.5 18.5,20.5 C17.3954,20.5 16.5,19.6046 16.5,18.5 C16.5,17.3954 17.3954,16.5 18.5,16.5 Z M5.5,10 C6.60457,10 7.5,10.8954 7.5,12 C7.5,13.1046 6.60457,14 5.5,14 C4.39543,14 3.5,13.1046 3.5,12 C3.5,10.8954 4.39543,10 5.5,10 Z M12,10 C13.1046,10 14,10.8954 14,12 C14,13.1046 13.1046,14 12,14 C10.8954,14 10,13.1046 10,12 C10,10.8954 10.8954,10 12,10 Z M18.5,10 C19.6046,10 20.5,10.8954 20.5,12 C20.5,13.1046 19.6046,14 18.5,14 C17.3954,14 16.5,13.1046 16.5,12 C16.5,10.8954 17.3954,10 18.5,10 Z M5.5,3.5 C6.60457,3.5 7.5,4.39543 7.5,5.5 C7.5,6.60457 6.60457,7.5 5.5,7.5 C4.39543,7.5 3.5,6.60457 3.5,5.5 C3.5,4.39543 4.39543,3.5 5.5,3.5 Z M12,3.5 C13.1046,3.5 14,4.39543 14,5.5 C14,6.60457 13.1046,7.5 12,7.5 C10.8954,7.5 10,6.60457 10,5.5 C10,4.39543 10.8954,3.5 12,3.5 Z M18.5,3.5 C19.6046,3.5 20.5,4.39543 20.5,5.5 C20.5,6.60457 19.6046,7.5 18.5,7.5 C17.3954,7.5 16.5,6.60457 16.5,5.5 C16.5,4.39543 17.3954,3.5 18.5,3.5 Z"
                                                id="形状" fill="#09244B"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </Link>
                    {/*logo*/}
                    <Link to={'/user-workspace'} className={'flex items-center justify-center gap-3'}>
                        <BsGrid1X2Fill/>
                        <p className="-ms-2 text-xl font-semibold text-gray-800">GCom</p>
                    </Link>
                </div>
                <div className="hidden lg:flex gap-4 text-sm text-gray-600">
                      <span
                          className="cursor-pointer hover:text-black flex items-center gap-2 text-gray-600 font-semibold text-md">
                          Workspaces <FaChevronDown/>
                      </span>
                    <span
                        className="cursor-pointer hover:text-black flex items-center gap-2 text-gray-600 font-semibold text-md">
                           Recent <FaChevronDown/>
                      </span>
                    <span
                        className="cursor-pointer hover:text-black flex items-center gap-2 text-gray-600 font-semibold text-md">
                           Starred <FaChevronDown/>
                     </span>
                    <span
                        className="cursor-pointer hover:text-black flex items-center gap-2 text-gray-600 font-semibold text-md">
                        Templates <FaChevronDown/>
                    </span>
                    <button onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md">Create
                    </button>
                </div>
                <div className={'lg:hidden'}>
                    <button
                        className="text-gray-400 px-2 py-1.5 rounded-md font-semibold text-md flex justify-center items-center gap-2">
                        More <FaChevronDown className={'h-2 w-2 font-bold'}/>
                    </button>
                </div>
                <div className="lg:hidden text-gray-600">
                    <button className="bg-gray-300 px-1.5 py-1.5 rounded-md"
                            onClick={() => setIsModalOpen(true)}
                    >
                        <FaPlus/>
                    </button>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 ms-2">
                <div className="relative items-center hidden md:flex">
                    <IoIosSearch className="absolute left-3 text-gray-500 w-4 h-4"/>
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-8 pr-3 py-1.5 border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-300 text-sm"
                    />
                </div>
                <IoIosSearch className="text-gray-500 w-5 h-5 md:hidden"/>
                <IoIosNotifications className="cursor-pointer text-gray-600 hover:text-black text-2xl"/>
                <IoIosHelpCircle
                    className="cursor-pointer text-gray-600 hover:text-black text-2xl hidden md:block"/>
                <AvatarDropdown/>
            </div>
            {createPortal(
                <BoardCreateModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>,
                document.body
            )}
        </nav>
    );
}
