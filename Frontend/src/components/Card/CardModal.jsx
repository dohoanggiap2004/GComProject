import {useEffect, useState} from 'react';
import {
    FaTimes,
    FaEye,
    FaUserPlus,
    FaTag,
    FaPaperclip,
    FaArrowRight,
    FaCopy,
    FaShareAlt,
    FaArchive,
    FaCheckCircle,
} from 'react-icons/fa';
import {ActivitySVG, CompletedSVG, DescriptionSVG} from "../Icon/icons.jsx";
import {useDispatch, useSelector} from "react-redux";
import {deleteCard, updateCard} from "../../store/actions/boardAction.jsx";
import {addMemberToCard, getCardWithTask, removeMemberFromCard} from "../../store/actions/cardAction.jsx";
import Checklist from "./Checklist.jsx";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import DateCardPickModal from "./DateCardPickModal.jsx";
import DateRange from "./DateRange.jsx";
import MemberCardModal from "./MemberCardModal.jsx";
import UploadFile from "./UploadFile.jsx";
import {getAttachmentsByCardId, removeAttachment} from "../../store/actions/attachmentAction.jsx";
import {formatDateTime} from "../../Utils/formatDate.jsx";
import {FaX} from "react-icons/fa6";

const CardModal = ({cardProp, onClose, onToggleCheck}) => {
    const {board} = useSelector((state) => state.board);
    const {card} = useSelector((state) => state.card);
    const {userInfo} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const {attachments} = useSelector((state) => state.attachment);

    const [formData, setFormData] = useState({
        boardId: board?._id,
        listId: cardProp.listId,
        _id: cardProp._id,
        title: card?.title || '',
        description: card?.description || '',
        memberIds: card?.memberIds || [],
        dueDate: card?.dueDate || null,
        startDate: card?.startDate || null,
        dateReminder: card?.dateReminder || null,
    })

    const handleToggleCheck = (e) => {
        e.stopPropagation();
        onToggleCheck();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleAddComment = (e) => {
        setComment(e.target.value);
    };

    const handleSubmitComment = () => {
        console.log('Comment button clicked');
        if (comment.trim()) {
            console.log('Comment submitted:', comment);
            setComment('');
        }
    };

    const handleWatchClick = () => {
        console.log('Watch button clicked');
    };

    const handleJoinClick = (e) => {
        e.preventDefault();
        const payload = {
            boardId: board?._id,
            listId: card?.listId,
            cardId: card?._id,
            userId: userInfo._id,
        }
        dispatch(addMemberToCard(payload));
    };

    const handleLeaveClick = (e) => {
        e.preventDefault();
        const payload = {
            boardId: board?._id,
            listId: card?.listId,
            cardId: card?._id,
            userId: userInfo._id,
        }
        dispatch(removeMemberFromCard(payload));
    };


    const handleMembersClick = () => {
        setIsMemberModalOpen(true);
    };


    // Hàm xử lý khi double-click vào tiêu đề
    const handleDoubleClickTitle = () => {
        setIsEditingTitle(true);
    };

    // Hàm xử lý khi người dùng thay đổi tiêu đề
    const handleTitleChange = (e) => {
        setFormData({
            ...formData,
            title: e.target.value,
        })
    };

    // Hàm xử lý khi người dùng nhấn Enter hoặc blur để lưu tiêu đề
    const handleUpdateCard = () => {
        if (formData.title.trim()) {
            dispatch(updateCard(formData))
        }
        setIsEditingTitle(false);
    };


    const handleDeleteCard = async () => {
        const payload = {
            boardId: formData.boardId,
            cardId: formData._id,
            listId: formData.listId,
        }
        try {
            await dispatch(deleteCard(payload)).unwrap();
            toast.success("Card already deleted successfully!");
            navigate(`/user-workspace/board/${formData.boardId}`);
        } catch (err) {
            toast.error(err || "Error while deleting card!");
        }
    }

    const handleDueDateChange = ({startDate, dueDate, dateReminder}) => {
        setFormData(prevState => {
            const updateFormData = {
                ...prevState,
                startDate: startDate,
                dueDate: dueDate,
                dateReminder: dateReminder,
            };
            dispatch(updateCard(updateFormData))
            return updateFormData;
        });
    }

    useEffect(() => {
        if (formData.listId && formData.boardId && formData._id) {
            dispatch(getCardWithTask({
                boardId: formData.boardId,
                listId: formData.listId,
                cardId: formData._id,
            }))
        }
    }, [formData.boardId, formData.listId, formData._id]);


    useEffect(() => {
        if (!cardProp) return;
        const memberIds = card?.memberIds?.map((m) => m._id) || [];
        setFormData({
            boardId: board?._id || '',
            _id: cardProp._id || '',
            listId: cardProp.listId || '',
            title: cardProp.title ?? '',
            description: cardProp.description ?? '',
            memberIds,
            dueDate: cardProp.dueDate || null,
            startDate: cardProp.startDate || null,
            dateReminder: cardProp.dateReminder || null,
        });
    }, [cardProp, card]);

    useEffect(() => {
        if (cardProp?._id)
            dispatch(getAttachmentsByCardId(cardProp._id))
    }, [cardProp?._id])

    const getMimeTypeLabel = (mimeType) => {
        // Xử lý các trường hợp phổ biến
        if (mimeType.includes('pdf')) return 'PDF';
        if (mimeType.includes('word') || mimeType.includes('doc')) return 'DOC';
        if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('xls')) return 'SHEET';
        if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'SLIDE';
        if (mimeType.includes('image/')) return 'IMG';
        if (mimeType.includes('video/')) return 'VIDEO';
        if (mimeType.includes('audio/')) return 'AUDIO';
        if (mimeType.includes('text/')) return 'TEXT';
        // Trường hợp mặc định
        return 'FILE';
    };

    const handleRemoveAttachment = async (e, _id) => {
        e.preventDefault();
        try {
            await dispatch(removeAttachment(_id)).unwrap();
            toast.success("Attachment already deleted successfully!");
        }catch (err){
            toast.error(err || "Error while deleting attachment!");
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div
                className="bg-white rounded-lg w-[95%] sm:w-[90%] md:w-[80%] lg:max-w-4xl p-6 relative z-50 max-h-[95vh] overflow-y-auto">
                {/* Nút đóng modal */}
                <button
                    onClick={() => {
                        onClose();
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50"
                >
                    <FaTimes size={20}/>
                </button>

                {/* Tiêu đề và thông tin list */}
                <div className="mb-4">
                    <div className={'flex items-center'}>
                        <div className="mr-2 cursor-pointer z-40" onClick={handleToggleCheck}>
                            {cardProp.isCompleted ? (
                                <FaCheckCircle className={'w-4 h-4'} color={'green'}/>
                            ) : (
                                <CompletedSVG/>
                            )}
                        </div>

                        {/* Tiêu đề: Hiển thị input khi đang chỉnh sửa, ngược lại hiển thị text */}
                        {isEditingTitle ? (
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleTitleChange}
                                onBlur={handleUpdateCard} // Lưu khi click ra ngoài
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUpdateCard(); // Lưu khi nhấn Enter
                                    }
                                }}
                                autoFocus
                                className="text-lg font-semibold border rounded-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-full me-4"
                            />
                        ) : (
                            <div
                                className="cursor-grab text-lg font-semibold"
                                onDoubleClick={handleDoubleClickTitle} // Double-click để chỉnh sửa
                            >
                                {formData.title}
                            </div>
                        )}
                    </div>
                </div>

                {/* Phần còn lại của modal giữ nguyên */}
                <div className="block md:flex">
                    {/* Phần nội dung chính (mô tả, hoạt động) */}
                    <div className="flex-1 pr-4">
                        {/* Notifications */}
                        <div className={'flex items-center'}>
                            <div className="flex items-center mb-4">
                                <FaEye className="mr-2 text-gray-500"/>
                                <button
                                    onClick={handleWatchClick}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    Watch
                                </button>
                            </div>

                            <DateRange startDate={formData.startDate} dueDate={formData.dueDate}/>
                        </div>


                        {/* Mô tả */}
                        <div className="mb-4">
                            <h3 className="font-semibold flex items-center">
                            <span className="mr-2 h-5 w-5">
                                <DescriptionSVG/>
                            </span>{' '}
                                Description
                            </h3>
                            <textarea
                                value={formData.description}
                                name="description"
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUpdateCard()
                                    }
                                }}
                                placeholder="Add a more detailed description..."
                                className="w-full p-2 mt-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className={'mb-6'}>
                            <Checklist/>
                        </div>

                        {/* Đính kèm (Attachments) */}
                        <div className="p-4 border rounded-lg w-full bg-white mb-4">
                            <h3 className="font-semibold flex items-center">
                                <FaPaperclip className="mr-2"/> Attachments
                            </h3>
                            <div className="mt-2">
                                {attachments.map((attachment) => (
                                    <div
                                        key={attachment._id}
                                        className="flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-2"
                                    >
                                        <div className="flex items-center">
                                       <span
                                           className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-sm mr-2">
                                             {getMimeTypeLabel(attachment.mimeType)}
                                       </span>
                                            <div>
                                                <a
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-500 hover:underline"
                                                >
                                                    {attachment.name}
                                                </a>
                                                <p className="text-xs text-gray-500">
                                                    Added {formatDateTime(new Date(attachment.createdAt))}
                                                </p>

                                            </div>
                                        </div>
                                        <button className="text-gray-500 hover:text-gray-700"
                                                onClick={(e) => handleRemoveAttachment(e, attachment._id)}
                                        >
                                            <FaX className={'w-3 h-3'}/>
                                        </button>
                                    </div>
                                ))}
                                <UploadFile cardId={cardProp._id}/>
                            </div>
                        </div>

                        {/* Hoạt động (Activity) */}
                        <div>
                            <div className={'flex items-center justify-between'}>
                                <div>
                                    <h3 className="font-semibold flex items-center">
                                    <span className="mr-2 h-5 w-5">
                                        <ActivitySVG/>
                                    </span>{' '}
                                        Activity
                                    </h3>
                                </div>

                                <button
                                    className="ml-4 text-sm font-semibold px-2 py-1.5 rounded-xs text-gray-500 bg-gray-100 hover:bg-gray-200">
                                    Hide details
                                </button>
                            </div>

                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={handleAddComment}
                                    placeholder="Write a comment..."
                                    className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <button
                                    onClick={handleSubmitComment}
                                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
                                >
                                    Comment
                                </button>
                            </div>

                            {/* Lịch sử hoạt động */}
                            <div className="mt-4 space-y-4">
                                <div className="flex items-start">
                                    <div
                                        className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold mr-2">
                                        GH
                                    </div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-semibold">Giáp Đỗ Hoàng</span> moved this card from To
                                            do to DONE
                                        </p>
                                        <p className="text-xs text-gray-500">Mar 23, 2025, 9:38 AM</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div
                                        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-2">
                                        ĐH
                                    </div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-semibold">Đỗ Hoàng Giáp</span>
                                        </p>
                                        <p className="text-sm">abc</p>
                                        <p className="text-xs text-gray-500">Mar 20, 2025, 7:48 PM</p>
                                        <div className="text-xs text-gray-500">
                                            <button className="hover:underline">Reply</button>
                                            •{' '}
                                            <button className="hover:underline">Delete</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div
                                        className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold mr-2">
                                        GH
                                    </div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-semibold">Giáp Đỗ Hoàng</span> added this card to To
                                            do
                                        </p>
                                        <p className="text-xs text-gray-500">Sep 27, 2024, 6:28 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* Phần sidebar bên phải (các nút hành động) */}
                        <div className="mt-6 gap-2 grid grid-cols-2 md:grid-cols-1">
                            {card?.memberIds?.map(member => member._id.toString()).includes(userInfo?._id.toString()) ? (
                                <button
                                    onClick={handleLeaveClick}
                                    className="w-full flex items-center bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-lg"
                                >
                                    <FaUserPlus className="mr-2"/> Leave
                                </button>
                            ) : (
                                <button
                                    onClick={handleJoinClick}
                                    className="w-full flex items-center bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-lg"
                                >
                                    <FaUserPlus className="mr-2"/> Join
                                </button>
                            )}


                            <div className="relative inline-block w-40">
                                <button
                                    onClick={handleMembersClick}
                                    className="w-full flex items-center bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-lg"
                                >
                                    <FaUserPlus className="mr-2"/> Members
                                </button>

                                {isMemberModalOpen && (
                                    <div
                                        className={`
                                            absolute z-50 
                                            top-full mt-2 w-max 
                                            right-0
                                            md:top-0 md:left-auto md:right-full md:ml-2
                                        `}
                                    >
                                        <MemberCardModal onClose={() => setIsMemberModalOpen(false)}/>
                                    </div>
                                )}
                            </div>

                            <button
                                className="w-full flex items-center bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-lg">
                                <FaTag className="mr-2"/> Labels
                            </button>

                            <DateCardPickModal onChangeDateTime={handleDueDateChange}/>

                            <button
                                className="w-full flex items-center bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-lg">
                                <FaPaperclip className="mr-2"/> Attachment
                            </button>
                        </div>
                        {/* Actions */}
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Actions</h4>
                            <div className="gap-2 grid grid-cols-2 md:grid-cols-1">
                                <button
                                    className="w-full flex items-center bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-lg">
                                    <FaArrowRight className="mr-2"/> Move
                                </button>
                                <button
                                    className="w-full flex items-center bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-lg">
                                    <FaCopy className="mr-2"/> Copy
                                </button>
                                <button
                                    className="w-full flex items-center bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-lg"
                                    onClick={handleDeleteCard}
                                >
                                    <FaArchive className="mr-2"/> Archive
                                </button>
                                <button
                                    className="w-full flex items-center bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 p-2 rounded-lg">
                                    <FaShareAlt className="mr-2"/> Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardModal;
