// Format date to "Apr 4" style
export const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

// Format time to "7:34 PM" style
export const formatTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

// Format full datetime if needed
export const formatDateTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    return `${formatDate(date)}, ${formatTime(date)}`;
};
