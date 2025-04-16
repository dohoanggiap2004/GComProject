const crypto = require('crypto')

function sortAndStringify(obj) {
    return Object.keys(obj)
        .sort()
        .map(key => `${key}=${obj[key] ?? ''}`)
        .join("&");
}

// ✅ Hàm kiểm tra signature
function isValidSignature(data, signature, key) {
    const sortedData = sortAndStringify(data);
    const hash = crypto.createHmac("sha256", key)
        .update(sortedData)
        .digest("hex");
    return hash === signature;
}

module.exports = { sortAndStringify, isValidSignature };
