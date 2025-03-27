import {useState} from 'react';
import {FaChevronDown, FaChevronUp, FaRegClipboard, FaRegHeart, FaUserFriends, FaCog} from 'react-icons/fa';
import {useSelector} from "react-redux";
import {GoPlus} from "react-icons/go";
import WorkspaceCreateModel from "../Modal/WorkspaceCreateModal.jsx";
import {FiPlus} from "react-icons/fi";

const VerticalWorkspace = () => {
    const {workspaces} = useSelector((state) => state.workspace);

    const [openWorkspaces, setOpenWorkspaces] = useState({});

    // Hàm toggle trạng thái từng workspace
    const toggleSection = (workspaceId) => {
        setOpenWorkspaces((prevState) => ({
            ...prevState,
            [workspaceId]: !prevState[workspaceId] // Đảo trạng thái của workspace đó
        }));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="mt-2">
            {Array.isArray(workspaces) && workspaces.length > 0 ? (
                workspaces.map(workspace => (
                    <div key={workspace._id}>
                        {/* Workspace Header */}
                        <button
                            className="flex items-center justify-between w-full p-2 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg text-sm"
                            onClick={() => toggleSection(workspace._id)}
                        >
                            <div className="flex items-center">
                                <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs mr-2">G</span>
                                {workspace.name.length > 15 ? `${workspace.name.slice(0, 15)}...` : workspace.name}
                            </div>

                            {openWorkspaces[workspace._id] ? <FaChevronUp className="text-gray-500"/> :
                                <FaChevronDown className="text-gray-500"/>}
                        </button>

                        {/* Các mục bên dưới, hiển thị khi isOpen là true */}
                        {openWorkspaces[workspace._id] && (
                            <div className="ml-6 space-y-2 mt-2">
                                <button
                                    className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                                    <FaRegClipboard className="mr-2"/> Boards
                                </button>
                                <button
                                    className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                                    <FaRegHeart className="mr-2"/> Hightlights
                                </button>
                                <button
                                    className="flex justify-between items-center w-full p-2 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                                    <div className="flex items-center">
                                        <FaUserFriends className="mr-2"/> Members
                                    </div>
                                    <FiPlus />
                                </button>
                                <button
                                    className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-200 rounded-lg text-sm">
                                    <FaCog className="mr-2"/> Settings
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                    <button
                        className="flex items-center justify-between w-full p-2 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg text-sm border-2 border-gray-900"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className="flex items-center">
                            <GoPlus className={'mr-2'}/> Create a Workspace
                        </span>
                    </button>
            )}
            <WorkspaceCreateModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        </div>
    );
};

export default VerticalWorkspace;
