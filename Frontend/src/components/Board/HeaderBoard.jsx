import {useState} from "react";
import {FiStar, FiUsers, FiFilter} from "react-icons/fi";
import {IoRocketOutline} from "react-icons/io5";
import {BsLightning} from "react-icons/bs";
import {HiDotsHorizontal} from "react-icons/hi";
import {GoPeople} from "react-icons/go";
import {useDispatch, useSelector} from "react-redux";
import {
    FaInfoCircle,
    FaList,
    FaArchive,
    FaCog,
    FaPaintRoller,
    FaPlus,
    FaEye,
    FaCopy,
    FaShareAlt,
    FaTimes
} from "react-icons/fa";
import {deleteBoard} from "../../store/actions/boardAction.js";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {createPortal} from "react-dom";
import AddMemberBoardModal from "./AddMemberBoardModal.jsx";

export default function HeaderBoard() {
    const {board, error} = useSelector((state) => state.board);
    const {role} = useSelector((state) => state.user);
    const [selectedOption, setSelectedOption] = useState("Bảng");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDeleteBoard = () => {
        const payload = {
            boardId: board._id,
            workspaceId: board.workspaceId,
        }
        dispatch(deleteBoard(payload));
        if (!error) {
            toast.success("Deleted the board", {
                duration: 3000
            })
            navigate('/user-workspace')
        } else {
            toast.error("Error while deleting board!")
        }
    }

    return (
        <div className="text-gray-700 flex items-center justify-between px-4 py-2 relative">
            {/* Left Section */}
            <div className="flex items-center gap-1">
                <span
                    className="font-bold px-3 py-1 rounded-md hover:bg-gray-300">{board ? board.title : 'Board'}</span>
                <div className={'px-3 py-2 rounded-md hover:bg-gray-300'}>
                    <FiStar className="text-sm"/>
                </div>
                <div className={'text-sm flex items-center font-semibold gap-2 px-3 py-1.5 rounded-md' +
                    ' hover:bg-gray-300'}>
                    <FiUsers className="text-sm"/>
                    Workspace visible
                </div>
                <select
                    className="bg-gray-400 font-semibold text-white px-1 py-1 rounded-md "
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                >
                    <option value="BoardItem">Board</option>
                    <option value="Calendar">Calendar</option>
                    <option value="Dashboard">Dashboard</option>
                </select>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                <IoRocketOutline className="text-sm"/>
                <BsLightning className="text-sm"/>
                <FiFilter className="text-sm"/>
                <div className="flex items-center gap-1">
                    <span className="bg-red-600 text-white rounded-full p-1 text-xs">GH</span>
                    <span className="bg-blue-600 text-white rounded-full p-1 text-xs">
                        <GoPeople/>
                    </span>
                </div>
                <button
                    className="bg-gray-400 text-white font-semibold px-3 py-1 rounded-sm flex items-center hover:bg-gray-500"
                    onClick={() => {
                        setIsModalOpen(true);
                    }}
                >
                    <GoPeople className={'mr-2'}/> Share
                </button>
                <div className="relative">
                    <button onClick={toggleMenu}>
                        <HiDotsHorizontal className="text-sm"/>
                    </button>

                    {/* Menu hiển thị khi click */}
                    {isMenuOpen && (
                        <div className="absolute top-8 right-0 w-64 bg-white text-gray-700 rounded-lg shadow-lg z-50">
                            {/* Tiêu đề menu */}
                            <div className="flex items-center justify-between p-3 border-b">
                                <h3 className="text-sm font-semibold">Menu</h3>
                                <button onClick={toggleMenu}>
                                    <FaTimes className="text-gray-500 hover:text-gray-700"/>
                                </button>
                            </div>

                            {/* Nội dung menu */}
                            <div className="p-2">
                                <button className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm">
                                    <FaInfoCircle className="mr-2 text-gray-500"/>
                                    About this board
                                    <span className="ml-1 text-xs text-gray-500">Add a description to your board</span>
                                </button>
                                <button className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm">
                                    <FaList className="mr-2 text-gray-500"/>
                                    Activity
                                </button>
                                <button className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm">
                                    <FaArchive className="mr-2 text-gray-500"/>
                                    Archived items
                                </button>
                                <div className="border-t my-2"></div>
                                <button className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm">
                                    <FaCog className="mr-2 text-gray-500"/>
                                    Settings
                                </button>
                                <button className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm">
                                    <FaPaintRoller className="mr-2 text-gray-500"/>
                                    Change background
                                </button>
                                <button className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm">
                                    <FaPlus className="mr-2 text-gray-500"/>
                                    Make template
                                    <span className="ml-auto text-xs text-purple-500">Upgrade</span>
                                </button>
                                <button className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm">
                                    <FaEye className="mr-2 text-gray-500"/>
                                    Watch
                                </button>
                                <button className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm">
                                    <FaCopy className="mr-2 text-gray-500"/>
                                    Copy board
                                </button>
                                <button className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm">
                                    <FaShareAlt className="mr-2 text-gray-500"/>
                                    Print, export, and share
                                </button>
                                <div className="border-t my-2"></div>
                                <button
                                    className="w-full flex items-center text-sm p-2 hover:bg-gray-100 rounded-sm text-red-500"
                                    onClick={() => {
                                        if (!['admin', 'workspaceMember'].includes(role)) {
                                            toast.error("You don't have permission to delete this board!");
                                            return;
                                        }
                                        setIsOpenDelete(true)
                                    }}
                                >
                                    <FaTimes className="mr-2"/>
                                    Permanently delete board
                                </button>

                                {isOpenDelete && (
                                    <div
                                        className="fixed inset-0 flex items-center justify-center z-50 ">
                                        <div className="absolute inset-0 bg-black opacity-50"></div>
                                        <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                                            {/* Close button */}
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                onClick={() => setIsOpenDelete(false)}
                                            >
                                                <FaTimes/>
                                            </button>

                                            {/* Modal content */}
                                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Delete board?</h2>
                                            <p className="text-sm text-gray-600 mb-6">
                                                All lists, cards and actions will be deleted, and you won’t be able to
                                                re-open the board. There is no undo.
                                            </p>

                                            {/* Delete button */}
                                            <button
                                                className="w-full bg-red-500 text-white py-2 rounded-sm hover:bg-red-600 transition-colors"
                                                onClick={handleDeleteBoard}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {createPortal(
                <AddMemberBoardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>,
                document.body
            )}
        </div>

    );
}
