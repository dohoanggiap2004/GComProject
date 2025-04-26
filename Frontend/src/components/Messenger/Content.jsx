import React, { useState, useEffect, useRef } from 'react';

// Fake data for boards and chat
const initialBoards = [
    {
        id: 1,
        name: 'Lớp 2 KTPM (Hậu)',
        tag: 'KTPM',
        lastMessage: 'Đơn t. vối 18 phút',
        time: '6 phút',
        messages: [
            { id: 1, sender: 'Ngọc', content: 'Hỏi đc có anh Hậu ý', time: '' },
            { id: 2, sender: 'Khô Vũ Tuấn', content: '😂', time: '' },
            { id: 3, sender: 'Ngọc', content: 'Ra chỗ cô có hội', time: '' },
            { id: 4, sender: 'Khô Vũ Tuấn', content: 'Kiêu j cha về đây', time: '' },
            { id: 5, sender: 'Ngọc', content: 'Mấy bạn trong KTX', time: '' },
            { id: 6, sender: 'Ngọc', content: 'Cho t mượn ở đây ở mua đ. K', time: '' },
            { id: 7, sender: 'Hỏi', content: 'Lan lê cảm ở t rời :))', time: '' },
            { id: 8, sender: 'Ngọc', content: 'Lan lê đi', time: '' },
            { id: 9, sender: 'Ngọc', content: 'Đơn t. vối', time: '' },
        ],
    },
    {
        id: 2,
        name: 'Quang Lee',
        tag: '',
        lastMessage: 'Tin nhắn và cuộc gọi được mã hóa đầu…',
        time: '26 phút',
        messages: [],
    },
    {
        id: 3,
        name: 'Thảo Nguyên',
        tag: '',
        lastMessage: 'Tin nhắn và cuộc gọi được mã hóa đầu…',
        time: '29 phút',
        messages: [],
    },
    {
        id: 4,
        name: 'Đỗ Trung Hòa',
        tag: '',
        lastMessage: 'Tin nhắn và cuộc gọi được mã hóa đầu…',
        time: '37 phút',
        messages: [],
    },
    {
        id: 5,
        name: 'Thu Hà',
        tag: '',
        lastMessage: 'Tin nhắn và cuộc gọi được mã hóa đầu…',
        time: '2 giờ',
        messages: [],
    },

];

const Content = () => {
    const [boards, setBoards] = useState(initialBoards);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [message, setMessage] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const chatContainerRef = useRef(null);

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
            const newMessage = {
                id: selectedBoard.messages.length + 1,
                sender: 'You',
                content: message,
                time: '',
            };
            const updatedBoards = boards.map((board) =>
                board.id === selectedBoard.id
                    ? { ...board, messages: [...board.messages, newMessage], lastMessage: message, time: 'Just now' }
                    : board
            );
            setBoards(updatedBoards);
            setSelectedBoard({ ...selectedBoard, messages: [...selectedBoard.messages, newMessage] });
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
                    {boards.map((board) => (
                        <div
                            key={board.id}
                            className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer ${
                                selectedBoard?.id === board.id ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => setSelectedBoard(board)}
                        >
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                                {board.tag && (
                                    <span className="text-xs text-white bg-green-500 px-1 rounded">{board.tag}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800">{board.name}</h2>
                                    <span className="text-xs text-gray-500">{board.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{board.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Chat Area */}
            <div className={`${isMobile && !selectedBoard ? 'hidden' : 'flex'} flex-col flex-1 bg-gray-50 rounded-2xl shadow-2xl`}>
                {selectedBoard ? (
                    <>
                        <div className="p-4 bg-white flex items-center border-b border-gray-200 rounded-t-2xl">
                        {isMobile && (
                                <button className="mr-3 text-gray-600" onClick={() => setSelectedBoard(null)}>
                                    ←
                                </button>
                            )}
                            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                            <h2 className="font-semibold text-gray-800">{selectedBoard.name}</h2>
                            <div className="ml-auto flex space-x-2">
                                <button className="text-gray-500">📞</button>
                                <button className="text-gray-500">📹</button>
                                <button className="text-gray-500">⋯</button>
                            </div>
                        </div>
                        <div
                            ref={chatContainerRef}
                            className="flex-1 p-4 overflow-y-auto "
                            // Adjust height to leave space for header
                            // and input
                        >
                            {selectedBoard.messages.length > 0 ? (
                                selectedBoard.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`mb-2 flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.sender !== 'You' && (
                                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                                        )}
                                        <div>
                                            {msg.sender !== 'You' && (
                                                <p className="text-xs text-gray-600">{msg.sender}</p>
                                            )}
                                            <div
                                                className={`max-w-xs p-2 rounded-lg ${
                                                    msg.sender === 'You'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-800'
                                                }`}
                                            >
                                                <p>{msg.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">Bắt đầu nhắn tin</p>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-white border-t border-gray-200 flex items-center rounded-b-2xl">
                        <button className="text-blue-500 mr-2">🔵</button>
                            <button className="text-blue-500 mr-2">📷</button>
                            <button className="text-blue-500 mr-2">🎁</button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Aa"
                                className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none text-sm"
                            />
                            <button className="text-blue-500 ml-2">😊</button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Chọn một đoạn chat để bắt đầu nhắn tin</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Content;
