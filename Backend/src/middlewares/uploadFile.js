const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // Giới hạn 50MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',                                                         // .pdf
            'application/msword',                                                      // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'text/csv',                                                                // .csv
            'application/vnd.ms-excel',                                                // .csv (1 số trình duyệt)
            'application/vnd.ms-powerpoint',                                           // .ppt
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only .doc, .docx, .csv, .pdf, .ppt, and .pptx are allowed.'), false);
        }
    },
});

module.exports = upload;
