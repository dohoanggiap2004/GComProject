import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import WorkspaceCreateModel from "../Workspace/WorkspaceCreateModal.jsx";
import {logoutUser} from "../../store/actions/authAction.jsx";
import {GoPlus} from "react-icons/go";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const AvatarDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const {quantityWorkspace} = useSelector(state => state.user)
    const {userInfo} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            toast.success('Logout successfully', {
                duration: 3000,
            });
            navigate('/');
        } catch (err) {
            toast.error(err || "Error while logout!");
        }
    }
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };


    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative">
            {/* Profile Button */}
            <button
                onClick={toggleModal}
                className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    {userInfo?.fullname?.slice(0, 2)}
                </div>
            </button>

            {/* Modal Content */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-68 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                     ref={modalRef}>
                    {/* Account Section */}
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase">Account</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <div
                                className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                                {userInfo?.fullname?.slice(0, 2)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">{userInfo?.fullname}</p>
                                <p className="text-xs text-gray-500">{userInfo?.email}</p>
                            </div>
                        </div>
                        <div className="mt-2 space-y-1">
                            <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-1 rounded-sm">
                                Manage account
                            </button>
                        </div>
                    </div>

                    {/* Create Workspace */}
                    <div className="p-4 border-b border-gray-200">
                        <button
                            className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-1 rounded-sm flex items-center space-x-2"
                            onClick={() => setIsWorkspaceOpen(true)}>
                            <span className="flex items-center">
                                <GoPlus className={'mr-2'}/>
                                <p>Create a Workspace
                                    {quantityWorkspace !== 'unlimited' ? ` (Remain ${(
                                        5 - quantityWorkspace
                                    ) >= 0 ? (
                                        5 - quantityWorkspace
                                    ) : 0})` : ''}
                                </p>
                            </span>
                        </button>
                    </div>
                    <WorkspaceCreateModel isOpen={isWorkspaceOpen} onClose={() => setIsWorkspaceOpen(false)}/>

                    {5 - quantityWorkspace <= 0 && (
                        <div className="p-4 border-b border-gray-200">
                            <button
                                className="w-full text-left text-sm text-blue-700 hover:bg-gray-100 p-1 rounded-sm flex items-center"
                                onClick={() => setIsWorkspaceOpen(true)}>
                            <span className="flex items-center">
                                Try GCom premium to get more workspaces
                            </span>
                            </button>
                        </div>
                    )}


                    {/* Help, Shortcuts, Log out */}
                    <div className="p-4">
                        <div className="space-y-1">
                            <button className="w-full text-left text-sm text-red-600 hover:bg-gray-100 p-1 rounded-sm"
                                    onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarDropdown;
