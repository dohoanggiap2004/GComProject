import NavbarWorkspace from "../components/Workspace/Navbar/Navbar-Workspace.jsx";
import SidebarBoard from "../components/Board/SidebarBoard.jsx";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {GoPlus} from "react-icons/go";
import {deleteWorkspace, getWorkspaceByWorkspaceId} from "../store/actions/workspaceAction.jsx";
import toast from "react-hot-toast";
import AddMemberModal from "../components/Member/AddMemberModal.jsx";

const WorkspaceSetting = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const { error, workspace } = useSelector(state => state.workspace)
    const [workspaceInput, setWorkspaceInput] = useState('');
    const workspaceId = location.state?.workspaceId || "Default Title";
    useEffect(() => {
        dispatch(getWorkspaceByWorkspaceId(workspaceId))
    }, [workspaceId])

    const handleDeleteWorkspace = () => {
        dispatch(deleteWorkspace(workspaceId));
        if(!error){
            navigate('/user-workspace')
            toast.success('Deleted Workspace Successfully');
        }else {
            toast.error('Deleted Workspace Failed!');
        }

    }
    return (
        <div className="flex flex-col h-screen">
            {/* Navbar cố định trên cùng */}
            <div className="shrink-0 bg-gray-200">
                <NavbarWorkspace/>
            </div>

            {/* Phần dưới: chia 2 cột (Sidebar trái - Nội dung phải) */}
            <div className="flex">
                <div className="w-72 shrink-0 hidden md:flex border-r-2 border-gray-200">
                    <SidebarBoard/>
                </div>
                <div className="flex flex-col items-center w-full m-4">
                    {/* Header */}
                    <div className={'max-w-[800px] mt-4'}>
                        <div className="block md:flex justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-12 h-12 bg-teal-500 text-white flex items-center justify-center rounded-sm">
                                    {workspace?.name?.slice(0, 1)}
                                </div>
                                <div className={' items-center space-x-2'}>
                                    <div className="text-lg font-semibold">{workspace?.name}</div>
                                    <div className="text-xs text-gray-500">Private</div>
                                </div>

                            </div>
                            <button
                                className="bg-blue-600 text-white px-4 py-1 rounded-sm flex items-center space-x-2 mt-4 md:mt-0"
                                onClick={() => setIsMemberModalOpen(true)}
                            >
                                <GoPlus/>
                                <span>Invite Workspace members</span>
                            </button>
                        </div>

                        <hr className={'border-r-2 border-gray-300 mb-4'}/>

                        {/* Main Content */}
                        <div className="max-w-3xl">
                            <h2 className="text-xl font-bold mb-4">Workspace settings</h2>

                            {/* Workspace Visibility */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Workspace visibility</h3>
                                <hr className={'border-r-2 border-gray-300'}/>
                                <div
                                    className="block md:flex md:justify-between md:items-center bg-white p-4 rounded-lg shadow-xs">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Private</span> - This Workspace is private.
                                            It’s not indexed or visible to those outside the Workspace.
                                        </p>
                                    </div>
                                    <button
                                        className="text-gray-500 border border-gray-300 px-3 py-1 rounded-sm hover:bg-gray-100 mt-4 md:mt-0 md:ms-6">
                                        Change
                                    </button>
                                </div>
                            </div>

                            {/* Sharing Boards with Guests */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Sharing boards with guests</h3>
                                <hr className={'border-r-2 border-gray-300'}/>
                                <div
                                    className="block md:flex md:justify-between md:items-center bg-white p-4 rounded-lg shadow-xs">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm text-gray-600">
                                            Anybody can send and receive invitations
                                            to boards in this Workspace.
                                        </p>
                                    </div>
                                    <button
                                        className="text-gray-500 border border-gray-300 px-3 py-1 rounded-sm hover:bg-gray-100 mt-4 md:mt-0 md:ms-6">
                                        Change
                                    </button>
                                </div>
                            </div>

                            {/* Delete Workspace */}
                            <div className="mt-6">
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)} // Mở modal khi nhấp
                                    className="text-red-600 hover:underline"
                                >
                                    Delete this Workspace?
                                </button>

                                {/* Modal Xóa Workspace */}
                                {isDeleteModalOpen && (
                                    <div
                                        className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                                            {/* Nút đóng modal */}
                                            <button
                                                onClick={() => setIsDeleteModalOpen(false)}
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>

                                            {/* Tiêu đề modal */}
                                            <h3 className="text-lg font-semibold mb-4">Delete Workspace?</h3>

                                            {/* Thông tin yêu cầu nhập tên Workspace */}
                                            <p className="text-sm text-gray-600 mb-2">
                                                Enter the Workspace name <span
                                                className="font-semibold">"{workspace?.name}"</span> to delete
                                            </p>

                                            {/* Danh sách cảnh báo */}
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 font-semibold">Things to know:</p>
                                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                    <li>This is permanent and can’t be undone.</li>
                                                    <li>All boards in the Workspace will be closed.</li>
                                                    <li>Board admins can reopen boards.</li>
                                                    <li>Board members will not be able to interact with closed boards.
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Input để nhập tên Workspace */}
                                            <p className="text-sm text-gray-600 font-semibold mb-2">Enter the Workspace
                                                name to delete</p>
                                            <input
                                                type="text"
                                                value={workspaceInput}
                                                onChange={(e) => setWorkspaceInput(e.target.value)}
                                                placeholder="Enter Workspace name"
                                                className="w-full p-2 border border-gray-300 rounded-sm mb-4 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                            />

                                            {/* Nút xóa */}
                                            <button
                                                disabled={workspaceInput !== workspace?.name}
                                                className={`w-full py-2 rounded text-white ${
                                                    workspaceInput === workspace?.name
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-gray-300 cursor-not-allowed"
                                                }`}
                                                onClick={handleDeleteWorkspace}
                                            >
                                                Delete Workspace
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <AddMemberModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkspaceSetting;
