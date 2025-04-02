import {useEffect, useState} from "react";

const DateRange = ({startDate, dueDate}) => {
    const formatDate = (date) => {
        // Check if date is a valid Date object
        if (!(date instanceof Date) || isNaN(date)) {
            return "";
        }
        return date.toLocaleDateString("en-US", {
            month: "short", // "Apr"
            day: "numeric", // "4"
        });
    };

    // Function to format the time from a Date object to "h:mm A" (e.g., "7:34 PM")
    const formatTime = (date) => {
        // Check if date is a valid Date object
        if (!(date instanceof Date) || isNaN(date)) {
            return "";
        }
        return date.toLocaleTimeString("en-US", {
            hour: "numeric", // "7"
            minute: "2-digit", // "34"
            hour12: true, // "PM"
        });
    };

    const [dateRangeDisplay, setDateRangeDisplay] = useState('');

    useEffect(() => {
        // Convert the string dates to Date objects
        const startDate2 = startDate ? new Date(startDate) : null;
        const dueDate2 = dueDate ? new Date(dueDate) : null;

        // Format the start and due dates
        const formattedStartDate = formatDate(startDate2);
        const formattedDueDate = formatDate(dueDate2);
        const formattedDueTime = formatTime(dueDate2); // Extract time from dueDate

        formattedStartDate && formattedDueDate
            ? setDateRangeDisplay(`${formattedStartDate} - ${formattedDueDate}, ${formattedDueTime}`)
            : setDateRangeDisplay('');
    }, [startDate, dueDate]);

    return (
        <div className="ml-4 mb-4">
            <button className="text-sm text-blue-600 hover:underline flex items-center">
                {dateRangeDisplay}
            </button>
        </div>
    )
}

export default DateRange;
