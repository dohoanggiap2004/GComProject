import {useEffect, useRef, useState} from "react";
import {FaTimes} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {FaX} from "react-icons/fa6";
import toast from "react-hot-toast";
import {addMemberToCard, removeMemberFromCard} from "../../store/actions/cardAction.jsx";

export default function MemberCardModal({onClose}) {
    const modalRef = useRef(null);
    const {card} = useSelector((state) => state.card);
    const {board, membersInBoard} = useSelector((state) => state.board);
    const {role, userInfo} = useSelector((state) => state.user);
    const [memberIds, setMemberIds] = useState([]);
    const [memberShow, setMemberShow] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        function handleClickOutside(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

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
        const filteredMembers = membersInBoard?.filter(member =>
            member.fullname.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setMemberShow(filteredMembers);
    }, 300);

    // Xử lý chọn người dùng từ danh sách
    const handleSelectUser = async (e, userId) => {
        e.preventDefault();
        if (!memberIds.some(_id => _id === userId)) {
            const newMemberIds = [...new Set([...memberIds, userId])];

            const payload = {
                boardId: board._id,
                listId: card.listId,
                cardId: card._id,
                userId: userId
            };

            if (board?._id) {
                try {
                    await dispatch(addMemberToCard(payload)).unwrap();
                    toast.success('Add member successfully.');
                    setMemberIds(newMemberIds);
                    onClose();
                } catch (err) {
                    toast.error(err || "Error while adding member");
                }
            }
        }
    };

    const handleDeleteMember = async (e, userId) => {
        e.preventDefault();

        const newMemberIds = memberIds.filter(id => id !== userId);

        if (board?._id) {
            const payload = {
                boardId: board._id,
                listId: card.listId,
                cardId: card._id,
                userId: userId
            };
            try {
                await dispatch(removeMemberFromCard(payload)).unwrap();
                toast.success('Remove member successfully.');
                setMemberIds(newMemberIds);
                onClose();
            } catch (err) {
                toast.error(err || "Error while adding member");
            }
        }
    };

    useEffect(() => {
        if (card?.memberIds) {
            const idMemberInCard = card?.memberIds.map(member => member._id);
            setMemberIds(idMemberInCard);
        }
    }, [card]);

    useEffect(() => {
        setMemberShow(membersInBoard)
    }, [membersInBoard])

    return (
        <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-[320px] p-4 border border-gray-300"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Members</h2>
                <button onClick={onClose}>
                    <FaTimes/>
                </button>
            </div>
            <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search for users"
                onChange={handleOnChange}
            />
            <p className="text-sm text-gray-600 mt-4 mb-2">Card members</p>
            <div className="">
                {card.memberIds.length > 0 && card.memberIds.map(member => (
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer relative">
                        <div
                            className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {member?.fullname.slice(0, 2)}
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">{member?.fullname}</h2>
                            <h2 className="text-xs">{member?.email}</h2>
                        </div>
                        {(
                            ['admin', 'workspaceMember'].includes(role) || card.memberIds.map(mem => mem._id.toString()).includes(userInfo._id)
                        ) && (
                            <button
                            onClick={(e) => handleDeleteMember(e, member._id)}>
                                <FaX
                                    className="h-2 w-2 absolute top-3 right-2 cursor-pointer text-gray-500 hover:text-black"/>
                            </button>
                        )}
                    </div>
                ))
                }

            </div>

            <p className="text-sm text-gray-600 mt-4 mb-2">Board members</p>
            <div className="">
                {memberShow?.length > 0 && memberShow?.map(member => (
                    <div
                        className={`flex items-center gap-3 p-2 rounded hover:bg-gray-100 relative cursor-pointer ${
                            memberIds.includes(member._id) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={(e) => handleSelectUser(e, member._id)}
                        key={member?._id}
                    >
                        <div
                            className={`w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold `}
                        >
                            {member?.fullname?.slice(0, 2)}
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">{member?.fullname}</h2>
                            <h2 className="text-xs">{member?.email}</h2>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    );
}
