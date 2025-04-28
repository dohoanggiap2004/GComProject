import {useState} from "react";
import {useDispatch} from "react-redux";
import {createWorkspace} from "../../store/actions/workspaceAction.jsx";
import toast from "react-hot-toast";

const WorkspaceCreateModal = ({isOpen, onClose}) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createWorkspace(formData)).unwrap();
            toast.success("Workspace created successfully.");
            onClose();
        } catch (err) {
            toast.error(err || "Error creating workspace.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-2xl z-50">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Let's build a Workspace</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
                </div>
                <p className="text-gray-600 mb-4">
                    Boost your productivity by making it easier for everyone to access boards in one location.
                </p>

                {/* Form */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Workspace name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-sm"
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Workspace type</label>
                    <select
                        className="w-full p-2 border rounded-sm"
                        name='type'
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="">Choose...</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                        <option value="Small Business">Small Business</option>
                        <option value="Engineering-IT">Engineering-IT</option>
                        <option value="Education">Education</option>
                        <option value="Sales CRM">Sales CRM</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Workspace description (Optional)</label>
                    <textarea
                        className="w-full p-2 border rounded-sm"
                        name='description'
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        onClick={(e) => handleSubmit(e)}
                        className={`px-4 py-2 rounded ${
                            formData.name ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!formData.name}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceCreateModal;
