import { useEffect, useState } from "react";
import { createBoard } from "../../store/actions/boardAction.js";
import { useDispatch, useSelector } from "react-redux";
import { getWorkspaceByMemberId } from "../../store/actions/workspaceAction.js";
import toast from "react-hot-toast";

const CreateBoardModal = ({ isOpen, onClose, selectedWorkspaceId }) => {
    const dispatch = useDispatch();
    const { workspaces } = useSelector((state) => state.workspace);
    const { error } = useSelector((state) => state.board);
    const backgrounds = [
        "",
        "http://localhost:8000/img/bg-gray.jpeg",
        "http://localhost:8000/img/cyan.jpg",
        "http://localhost:8000/img/bg-sea.jpeg",
        "http://localhost:8000/img/bg-purple.jpg",
        "http://localhost:8000/img/white.jpg",
        "http://localhost:8000/img/peach.jpg",
        "http://localhost:8000/img/white2.jpg",
    ];

    useEffect(() => {
        dispatch(getWorkspaceByMemberId());
    }, []);

    const [formData, setFormData] = useState({
        workspaceId: selectedWorkspaceId,
        title: "",
        background: backgrounds[0],
        visibility: "Workspace",
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            workspaceId: selectedWorkspaceId || '',
        }));
    }, [selectedWorkspaceId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBackgroundSelect = (bg) => {
        setFormData((prev) => ({ ...prev, background: bg }));
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) return;
        try {
            // Dispatch action tạo board và đợi kết quả trả về
            await dispatch(createBoard(formData)).unwrap(); // unwrap giúp bắt lỗi nếu có
            toast.success("Created new board!");

            // Reset formData nếu tạo board thành công
            setFormData({
                workspaceId: selectedWorkspaceId,
                title: "",
                background: backgrounds[0],
                visibility: "Workspace",
            });
        } catch (err) {
            // Bắt lỗi nếu có và hiển thị thông báo lỗi
            toast.error(err.message || "Error while creating board!");
        }
        onClose();
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white w-[420px] rounded-lg shadow-xl z-50">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                    <h2 className="text-lg font-semibold">Create board</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    {/* Preview Section */}
                    <div
                        className="relative w-full h-[120px] rounded-md mb-4"
                        style={{
                            backgroundImage: `url(${formData.background})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex gap-2">
                                <div className="w-[60px] h-[80px] bg-gray-300 opacity-70 rounded-sm"></div>
                                <div className="w-[60px] h-[80px] bg-gray-300 opacity-70 rounded-sm"></div>
                                <div className="w-[60px] h-[80px] bg-gray-300 opacity-70 rounded-sm"></div>
                            </div>
                        </div>
                    </div>

                    {/* Background Selection */}
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {backgrounds.map((bg, index) => (
                            <button
                                key={index}
                                className={`w-full h-[40px] rounded overflow-hidden border ${
                                    formData.background === bg ? "border-blue-500 ring-2 ring-blue-400" : "border-gray-300"
                                }`}
                                style={{
                                    backgroundImage: `url(${bg})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                                onClick={() => handleBackgroundSelect(bg)}
                            />
                        ))}
                    </div>

                    {/* Board Title */}
                    <label className="block text-sm font-medium text-gray-700">Board title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter board title"
                        className={`w-full border p-2 mt-1 rounded-sm focus:outline-blue-500 ${
                            !formData.title.trim() ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {!formData.title.trim() && (
                        <p className="text-red-500 text-sm mt-1">👋 Board title is required</p>
                    )}

                    {/* Workspace */}
                    <label className="block text-sm font-medium text-gray-700 mt-4">Workspace</label>
                    <select
                        name="workspaceId"
                        value={formData.workspaceId}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-sm mt-1 focus:outline-blue-500 border-gray-300"
                    >
                        {workspaces.map((workspace) => (
                            <option key={workspace._id} value={workspace._id}>
                                {workspace.name}
                            </option>
                        ))}
                    </select>

                    {/* Visibility */}
                    <label className="block text-sm font-medium text-gray-700 mt-4">Visibility</label>
                    <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-sm mt-1 focus:outline-blue-500 border-gray-300"
                    >
                        <option value="Workspace">Workspace</option>
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
                    </select>

                    {/* Create Button */}
                    <button
                        onClick={handleSubmit}
                        className={`w-full mt-6 py-2 rounded-sm ${
                            formData.title.trim()
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!formData.title.trim()}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default CreateBoardModal;
