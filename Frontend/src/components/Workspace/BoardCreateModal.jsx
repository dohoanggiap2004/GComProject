import {useEffect, useState} from "react";
import {createBoard} from "../../store/actions/boardAction.js";
import {useDispatch, useSelector} from "react-redux";
import {getWorkspaceByMemberId} from "../../store/actions/workspaceAction.js";

const CreateBoardModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { workspaces } = useSelector((state) => state.workspace);
    const backgrounds = [
        "http://localhost:8000/img/bg-pink.jpg",
        "http://localhost:8000/img/bg-gray.jpeg",
        "http://localhost:8000/img/bg-sea.jpeg",
        "http://localhost:8000/img/bg-purple.jpg",
    ];

    useEffect(() => {
        dispatch(getWorkspaceByMemberId())
    }, [])

    const [formData, setFormData] = useState({
        workspaceId: workspaces[0]?._id || '',
        title: "",
        background: backgrounds[0],
        visibility: "Workspace",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBackgroundSelect = (bg) => {
        setFormData((prev) => ({ ...prev, background: bg }));
    };

    const handleSubmit = () => {
        if (!formData.title.trim()) {
            alert("BoardItem title is required!");
            return;
        }
        dispatch(createBoard(formData))
        onClose();
    };

    useEffect(() => {
        setFormData({
            ...formData,
            workspaceId: workspaces[0]?._id || '',
        })
    }, [workspaces]);

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg z-50">
                <h2 className="text-xl font-semibold mb-4">Create board</h2>

                {/* Chọn Background */}
                <label className="block text-sm font-medium text-gray-700">Background</label>
                <div className="grid grid-cols-4 gap-2 my-2">
                    {backgrounds.map((bg, index) => (
                        <button
                            key={index}
                            className={`w-16 h-12 rounded border ${
                                formData.background === bg ? "border-blue-500 ring-2 ring-blue-400" : "border-gray-300"
                            }`}
                            style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
                            onClick={() => handleBackgroundSelect(bg)}
                        />
                    ))}
                </div>

                {/* Nhập tiêu đề */}
                <label className="block text-sm font-medium text-gray-700">Board title *</label>
                <input
                    type="text"
                    className="w-full border p-2 rounded-sm mt-1 focus:outline-blue-500"
                    placeholder="Enter board title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
                {!formData.title.trim() && <p className="text-red-500 text-xs mt-1">⚠ Board title is required</p>}

                {/* Chọn workspace */}
                <label className="block text-sm font-medium text-gray-700 mt-3">Wokspace</label>
                <select
                    className="w-full border p-2 rounded-sm mt-1 focus:outline-blue-500"
                    name="workspaceId"
                    value={formData.workspaceId}
                    onChange={handleChange}
                >
                    {Array.isArray(workspaces) && workspaces.length > 0 && workspaces.map((workspace) => (
                        <option key={workspace._id} value={workspace._id}>{workspace.name}</option>
                    ))}
                </select>

                {/* Chọn Visibility */}
                <label className="block text-sm font-medium text-gray-700 mt-3">Visibility</label>
                <select
                    className="w-full border p-2 rounded-sm mt-1 focus:outline-blue-500"
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                >
                    <option value="Workspace">Workspace</option>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                </select>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-sm">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded ${
                            formData.title.trim() ? "bg-blue-600 text-white" : "bg-gray-400 cursor-not-allowed"
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
