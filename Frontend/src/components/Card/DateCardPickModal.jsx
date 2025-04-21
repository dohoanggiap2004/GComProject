import {FaCalendar} from "react-icons/fa";
import {useState} from "react";

const DateCardPickModal = ({onChangeDateTime}) => {
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isDueDateEnabled, setIsDueDateEnabled] = useState(true);
    const [isStartDateEnabled, setIsStartDateEnabled] = useState(false);

    // State for selected dates
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState(() => {
        const now = new Date();
        now.setDate(now.getDate() + 1); // Cộng thêm một ngày
        return now.toISOString().slice(0, 16); // Lấy định dạng yyyy-MM-ddTHH:mm
    });
    const [dateReminder, setDateReminder] = useState(
        new Date(new Date(dueDate).setDate(new Date(dueDate).getDate() - 1))
            .toISOString()
            .slice(0, 16) // Định dạng chuẩn cho datetime-local
    );
    const today = new Date().toISOString().split("T")[0]; // Ngày hiện tại (YYYY-MM-DD)
    const handleSave = () => {
        // Pass the selected dates, time, and reminder to the parent component
        onChangeDateTime({
            startDate,
            dueDate: isDueDateEnabled ? dueDate : null,
            dateReminder
        });
        setIsDateModalOpen(false);
    };

    const handleReminderChange = (e) => {
        const daysBefore = parseInt(e.target.value, 10);
        const dueDateObj = new Date(dueDate);
        const reminderDateObj = new Date(dueDateObj);
        reminderDateObj.setDate(dueDateObj.getDate() - daysBefore);

        // Nếu ngày nhắc nhở nhỏ hơn hôm nay, đặt nó thành hôm nay
        const reminderDate = reminderDateObj.toISOString().split("T")[0];
        setDateReminder(reminderDate < today ? today : reminderDate);
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        // Nếu dueDate nhỏ hơn startDate, cập nhật lại dueDate
        if (newStartDate > dueDate.split("T")[0]) {
            setDueDate(`${newStartDate}T00:00`);
        }
    };

    const handleDueDateChange = (e) => {
        const newDueDate = e.target.value;
        if (newDueDate >= `${startDate}T00:00`) {
            setDueDate(newDueDate);
        }
    };

    return (
        <div className="relative">
            {/* Dates Button */}
            <button
                className={`w-full flex items-center bg-gray-100 hover:bg-gray-200 text-sm p-2 rounded-lg ${
                    isDateModalOpen
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsDateModalOpen(!isDateModalOpen)} // Toggle the dropdown
            >
                <FaCalendar className="mr-2"/> Dates
            </button>

            {/* Date Picker Dropdown */}
            {isDateModalOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg p-4 w-80 shadow-lg z-10">
                    {/* Start Date */}
                    <div className="mb-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isStartDateEnabled}
                                onChange={() => setIsStartDateEnabled(!isStartDateEnabled)}
                                className="mr-2"
                            />
                            <label className="block text-xs text-gray-600 mb-1">Start date</label>
                        </div>

                        <input
                            type="date"
                            value={startDate}
                            min={today} // Chỉ cho phép chọn từ ngày hôm nay trở đi
                            disabled={!isStartDateEnabled}
                            onChange={handleStartDateChange}
                            className={`w-full p-2 border rounded text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                                !isStartDateEnabled ? "bg-gray-100 text-gray-400" : ""
                            }`}
                        />
                    </div>

                    {/* Due Date */}
                    <div className="mb-4">
                        <div className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                checked={isDueDateEnabled}
                                onChange={() => setIsDueDateEnabled(!isDueDateEnabled)}
                                className="mr-2"
                            />
                            <label className="block text-xs text-gray-600">Due date</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="flex items-center w-full">
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    min={`${startDate}T00:00`} // Chỉ cho phép chọn >= startDate
                                    disabled={!isDueDateEnabled}
                                    onChange={handleDueDateChange}
                                    className={`w-full p-2 border rounded text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                                        !isDueDateEnabled ? "bg-gray-100 text-gray-400" : ""
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reminder */}
                    <div className="mb-4">
                        <label className="block text-xs text-gray-600 mb-1">Set due date reminder</label>
                        <select
                            onChange={handleReminderChange}
                            className="w-full p-2 border rounded-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="1">1 Day before</option>
                            <option value="2">2 Days before</option>
                            <option value="3">3 Days before</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Reminders will be sent to all members and watchers of this card.
                        </p>
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
                                setIsDateModalOpen(false)
                            }}
                            className="w-full bg-gray-200 text-gray-700 p-2 rounded-sm hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateCardPickModal;
