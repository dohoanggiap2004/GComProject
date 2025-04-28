import {useState, useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import socket from "../../service/socket.io.jsx";
import {formatDateTime} from "../../Utils/formatDate.jsx";
import {IoSend} from "react-icons/io5";
import {CiCamera, CiImageOn} from "react-icons/ci";
import {IoIosAttach, IoIosMore} from "react-icons/io";
import {FaPhone, FaVideo} from "react-icons/fa";

const Content = () => {
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [message, setMessage] = useState('');
    const [initialMessages, setInitialMessages] = useState(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const chatContainerRef = useRef(null);
    const {boardWithMessages} = useSelector(state => state.message)
    const {userInfo} = useSelector(state => state.auth)
    // Kết nối và tham gia phòng chat
    useEffect(() => {
        if (selectedBoard !== null) {
            // Tham gia phòng
            // console.log('Join board', selectedBoard?._id);
            socket.emit('joinBoard', selectedBoard?._id);

            // Nhận tin nhắn ban đầu
            socket.on('initialMessages', (initialMessages) => {
                setInitialMessages(initialMessages)
            });

            // Nhận tin nhắn ban đầu
            socket.on('receiveMessage', (newMessage) => {
                if (newMessage && typeof newMessage === 'object') {
                    setInitialMessages(prev => Array.isArray(prev) ? [...prev, newMessage] : [newMessage]);
                }
            });

            // Xử lý lỗi
            socket.on('error', (error) => {
                alert(error);
            });

            // Dọn dẹp khi component unmount hoặc boardId thay đổi
            return () => {
                socket.emit('leaveBoard', selectedBoard?._id);
                socket.off('initialMessages');
                socket.off('receiveMessage');
                socket.off('error');
            };
        }
    }, [selectedBoard]);

    // Handle resize for mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-scroll to the bottom when messages change or board is selected
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [selectedBoard?.messages]);

    const handleSendMessage = () => {
        if (message.trim() && selectedBoard) {
            // Gửi tin nhắn qua socket
            socket.emit('sendMessage', {
                boardId: selectedBoard._id,
                content: message
            });

            // Reset input field
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };


    return (
        <div className="flex h-[90vh] gap-4 font-sans mt-4 md:mx-4">
            {/* Board List */}
            <div className={`${isMobile && selectedBoard ? 'hidden' : 'flex'} flex-col w-full md:w-1/3 bg-white 
            rounded-2xl shadow-2xl`}>
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-800">Chat message</h1>
                    <div className="mt-2">
                        <input
                            type="text"
                            placeholder="Search in messenger"
                            className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-y-auto">
                    {Array.isArray(boardWithMessages) && boardWithMessages.length > 0 && boardWithMessages.map((board) => (
                        <div
                            key={board?._id}
                            className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer ${
                                selectedBoard?._id === board?._id ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => setSelectedBoard(board)}
                        >
                            <div className={`mr-3 flex items-center justify-center`}>
                                {board?.background ? (
                                    <img className="w-10 h-10 rounded-full" src={board?.background} alt={'background'}/>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white"></div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800">{board?.title}</h2>
                                    <span
                                        className="text-xs text-gray-500">{formatDateTime(new Date(board?.lastMessage?.createdAt))}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                    {board?.lastMessage?.content || 'No messages'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Chat Area */}
            <div
                className={`${isMobile && !selectedBoard ? 'hidden' : 'flex'} flex-col flex-1 bg-gray-50 rounded-2xl shadow-2xl`}>
                {selectedBoard ? (
                    <>
                        <div className="p-4 bg-white flex items-center border-b border-gray-200 rounded-t-2xl">
                            {isMobile && (
                                <button className="mr-3 text-gray-600" onClick={() => setSelectedBoard(null)}>
                                    ←
                                </button>
                            )}
                            {selectedBoard?.background ? (
                                <img className="w-8 h-8 rounded-full" src={selectedBoard?.background}
                                     alt={'background'}/>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-white"></div>
                            )}
                            <h2 className="ms-2 font-semibold text-gray-800">{selectedBoard?.title}</h2>
                            <div className="ml-auto flex space-x-2">
                                <button className="text-gray-500"><FaPhone/></button>
                                <button className="text-gray-500"><FaVideo/></button>
                                <button className="text-gray-500"><IoIosMore/></button>
                            </div>
                        </div>
                        <div
                            ref={chatContainerRef}
                            className="flex-1 p-4 overflow-y-auto "
                            // Adjust height to leave space for header
                            // and input
                        >
                            {Array.isArray(initialMessages) && initialMessages.length > 0 ? (
                                initialMessages.map((msg) => (
                                    <div
                                        key={msg?._id}  // Sử dụng _id từ MongoDB
                                        className={`mb-2 flex ${msg?.sender?._id === userInfo?._id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg?.sender?._id !== userInfo?._id && (
                                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                                        )}
                                        <div>
                                            {msg?.sender?._id !== userInfo?._id && (
                                                <p className="text-xs text-gray-600">{msg?.sender?.fullname || 'Unknown'}</p>
                                            )}
                                            <div
                                                className={`max-w-xs p-2 rounded-lg ${
                                                    msg?.sender?._id === userInfo?._id
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-800'
                                                }`}
                                            >
                                                <p>{msg?.content || ''} </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">Start messaging</p>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-white border-t border-gray-200 flex items-center rounded-b-2xl">
                            <button className="text-blue-500 mr-2"><CiImageOn/></button>
                            <button className="text-blue-500 mr-2"><CiCamera/></button>
                            <button className="text-blue-500 mr-2"><IoIosAttach/></button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Aa"
                                className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none text-sm"
                            />
                            <button
                                className="text-blue-500 ml-2"
                                onClick={handleSendMessage}
                            >
                                <IoSend/>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Select a conversation to start messaging. </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Content;
