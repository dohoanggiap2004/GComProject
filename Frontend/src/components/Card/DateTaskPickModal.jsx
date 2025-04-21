
import {useState} from "react";

const DateTaskPickModal = ({onChangeDateTime, onClose}) => {
    const [isDueDateEnabled, setIsDueDateEnabled] = useState(true);

    // State for selected dates
    const [dueDate, setDueDate] = useState(() => {
        const now = new Date();
        now.setDate(now.getDate() + 1); // Cộng thêm một ngày
        return now.toISOString().slice(0, 16); // Lấy định dạng yyyy-MM-ddTHH:mm
    });

    const today = new Date().toISOString().split("T")[0]; // Ngày hiện tại (YYYY-MM-DD)
    const handleSave = () => {
        // Pass the selected dates, time, and reminder to the parent component
        onChangeDateTime({
            dueDate: isDueDateEnabled ? dueDate : null,
        });
    };

    const handleDueDateChange = (e) => {
        const newDueDate = e.target.value;
        setDueDate(newDueDate);
    };

    return (
        <div className="relative">
            {/* Date Picker Dropdown */}
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg p-4 w-80 shadow-lg z-10">
                    {/* Due Date */}
                    <div className="mb-4">
                            <label className="block text-xs text-gray-600">Due date</label>

                        <div className="flex items-center space-x-2">
                            <div className="flex items-center w-full">
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    min={today}
                                    disabled={!isDueDateEnabled}
                                    onChange={handleDueDateChange}
                                    className={`w-full p-2 border rounded text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                                        !isDueDateEnabled ? "bg-gray-100 text-gray-400" : ""
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            className="w-full bg-blue-500 text-white p-2 rounded-sm hover:bg-blue-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                onClose()
                            }}
                            className="w-full bg-gray-200 text-gray-700 p-2 rounded-sm hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
        </div>
    );
};

export default DateTaskPickModal;
