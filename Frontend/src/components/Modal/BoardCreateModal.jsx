import {useEffect, useState} from "react";
import {createBoard} from "../../store/actions/boardAction.js";
import {useDispatch} from "react-redux";

const CreateBoardModal = ({ isOpen, onClose, workspaceId }) => {
    const dispatch = useDispatch();
    const backgrounds = [
        "http://localhost:8000/img/bg-pink.jpg",
        "http://localhost:8000/img/bg-gray.jpeg",
        "http://localhost:8000/img/bg-sea.jpeg",
        "http://localhost:8000/img/bg-purple.jpg",
    ];

    const [formData, setFormData] = useState({
        workspaceId: workspaceId,
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
            alert("Board title is required!");
            return;
        }
        console.log('check formdata', formData);

        dispatch(createBoard(formData))
        onClose();
    };

    useEffect(() => {
        setFormData({
            ...formData,
            workspaceId: workspaceId,
        })
    }, [workspaceId]);

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
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
                    className="w-full border p-2 rounded mt-1 focus:outline-blue-500"
                    placeholder="Enter board title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
                {!formData.title.trim() && <p className="text-red-500 text-xs mt-1">⚠ Board title is required</p>}

                {/* Chọn Visibility */}
                <label className="block text-sm font-medium text-gray-700 mt-3">Visibility</label>
                <select
                    className="w-full border p-2 rounded mt-1 focus:outline-blue-500"
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
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
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
