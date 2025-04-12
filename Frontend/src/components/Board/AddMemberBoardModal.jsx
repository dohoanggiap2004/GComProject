import {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {searchUser} from "../../store/actions/userAction.js";
import toast from "react-hot-toast";
import {updateBoard} from "../../store/actions/boardAction.js";

const AddMemberBoardModal = ({isOpen, onClose}) => {
    const dispatch = useDispatch();
    const {workspace} = useSelector((state) => state.workspace);
    const {board, membersInBoard, error} = useSelector((state) => state.board)
    const {usersSearch} = useSelector((state) => state.user);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [memberIds, setMemberIds] = useState([]);
    const [meberIdsInWorkspace, setMeberIdsInWorkspace] = useState([]);
    const [showSearchList, setShowSearchList] = useState(false);
    const inputRef = useRef(null);
    const allRoles = ['admin', 'member', 'viewer'];
    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (board?._id) {
            const members = memberIds.map(memberId => (
                {
                    memberId: memberId,
                    role: 'member'
                }
            ))
            dispatch(updateBoard({
                _id: board._id,
                members: members,
            }));
            onClose();
            if (!error) {
                toast.success('Add member successfully.');
            } else {
                toast.error("Error while adding member")
            }
        }
    };

    // Hàm debounce
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // Xử lý thay đổi trong input tìm kiếm
    const handleOnChange = debounce((e) => {
        dispatch(searchUser(e.target.value));
        setShowSearchList(true);
    }, 300);

    // Xử lý chọn người dùng từ danh sách tìm kiếm
    const handleSelectUser = (user) => {
        if (!memberIds.some(_id => _id === user._id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // Xử lý xóa người dùng đã chọn
    const handleRemoveUser = (userId) => {
        setSelectedUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        setMemberIds(prevIds => prevIds.filter(_id => _id !== userId));
    };

    // Xử lý khi input được focus
    const handleInputFocus = () => {
        setShowSearchList(true);
    };

    // Cập nhật memberIds khi selectedUsers thay đổi
    useEffect(() => {
        if (selectedUsers && Array.isArray(selectedUsers)) {
            setMemberIds(prevIds => [...new Set([...prevIds, ...selectedUsers.map(user => user._id)])]);
        }
    }, [selectedUsers]);

    // Reset state khi modal đóng
    useEffect(() => {
        if (!isOpen) {
            setSelectedUsers([]);
            // Kiểm tra workspace trước khi cập nhật
            setMemberIds([]);
            setShowSearchList(false);
            dispatch(searchUser(''));
        }
    }, [isOpen, board]);

    useEffect(() => {
        if (board?.members) {
            const idMemberFormBoard = board?.members.map(member => member.memberId);
            setMemberIds(idMemberFormBoard);
        }
    }, [board]);

    // Đóng danh sách tìm kiếm khi nhấp ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSearchList(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setMeberIdsInWorkspace(workspace?.memberIds)
    }, [workspace]);

    // useEffect(() => {
    //     console.log('memberId', memberIds)
    // }, [memberIds])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl z-50">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Invite to Board</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
                </div>

                <div className="relative">
                    {/* Hiển thị người dùng đã chọn */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedUsers.map((user) => (
                            <div key={user._id} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                                <span>{user.fullname}</span>
                                <button
                                    onClick={() => handleRemoveUser(user._id)}
                                    className="ml-2 text-red-500"
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={'flex items-center gap-4'}>
                        {/* Input tìm kiếm */}
                        <input
                            type="text"
                            className="w-full p-2 border rounded-sm text-gray-300 mt-2"
                            placeholder="Search for users"
                            onChange={handleOnChange}
                            onFocus={handleInputFocus}
                            ref={inputRef}
                        />

                        {/* Actions */}
                        <button
                            onClick={(e) => handleSubmit(e)}
                            className={`px-4 py-2 w-24 mt-2 rounded ${
                                selectedUsers.length > 0 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={selectedUsers.length === 0}
                        >
                            Invite
                        </button>
                    </div>


                    {/* Danh sách kết quả tìm kiếm */}
                    {showSearchList && Array.isArray(usersSearch) && usersSearch.length > 0 && (
                        <div className="bg-white p-4 absolute w-full top-16 mt-1 z-10" ref={inputRef}>
                            {usersSearch.map((user) => (
                                <div
                                    key={user?._id}
                                    className={`flex items-center space-x-2 mb-3 cursor-pointer ${
                                        memberIds.includes(user._id) || meberIdsInWorkspace.includes(user._id) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onClick={() => {
                                        if (!memberIds.includes(user._id) && !meberIdsInWorkspace.includes(user._id)) {
                                            handleSelectUser(user);
                                        }
                                    }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                                        {user?.fullname?.slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{user?.fullname}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={'mt-4'}>
                        <h3 className={'text-blue-500'}>Board members</h3>
                        <hr className={'text-gray-600 mt-2'}/>
                        {Array.isArray(membersInBoard) && membersInBoard.length > 0 && membersInBoard.map((member) => (
                            <div className={'flex justify-between items-center mt-3'}
                                 key={member?._id}
                            >
                                <div
                                    className={`flex items-center space-x-2 mb-3 cursor-pointer ${
                                        memberIds.includes(member._id) || meberIdsInWorkspace.includes(member._id) ? 'opacity-50' +
                                            ' cursor-not-allowed' : ''
                                    }`}
                                    onClick={() => {
                                        if (!memberIds.includes(member._id) && !meberIdsInWorkspace.includes(member._id)) {
                                            handleSelectUser(member);
                                        }
                                    }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                                        {member?.fullname?.slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{member?.fullname}</p>
                                        <p className="text-xs text-gray-500">{member?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <select
                                        value={member.role}
                                        // onChange={(e) => handleChangeRole(member._id, e.target.value)}
                                        // disabled={memberIds.includes(member._id) || meberIdsInWorkspace.includes(member._id)}
                                        className="px-2 py-1 border rounded mr-2"
                                    >
                                        {allRoles.map(role => (
                                            <option key={role} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="px-3 py-1 bg-red-100 text-red-500 rounded"
                                        // onClick={() => handleRemoveMember(member._id)}
                                        disabled={memberIds.includes(member._id) || meberIdsInWorkspace.includes(member._id)}
                                    >
                                        Remove from board
                                    </button>
                                </div>


                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AddMemberBoardModal;
