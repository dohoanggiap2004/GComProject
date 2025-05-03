const getUserIdFromToken = require("../../../utils/getUserIdFromToken");
const supabase = require("../../../config/supabase");
const path = require("path");
const mongoose = require("mongoose");
const {
    createAttachmentService,
    getAttachmentsByCardIdService,
    getAttachmentByIdService,
    deleteAttachmentService,

} = require("../../../services/apiService/attachmentService");
const { v4: uuidv4 } = require('uuid');

class AttachmentController{

    async getAttachmentsByCardId(req, res) {
        try {
            const cardId = req.params.cardId;
            if (!cardId)
                return res.status(400).json({message: "Card ID is required"});

            const attachments = await getAttachmentsByCardIdService(cardId);
            if (!attachments)
                return res.status(400).json({message: "Attachment not found"});

            res.status(200).json({
                data: attachments,
            })
        }catch (error) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    async uploadAttachment(req, res) {
        try {
            const file = req.file
            const { cardId } = req.body;

            const userId = await getUserIdFromToken(req)
            if (!userId || !file || !cardId)
                return res.status(400).json({message: "Uploader id, file, cardID is required"});

            const ext = path.extname(file.originalname);

            // Giải mã đúng tên file tiếng Việt
            const decodedOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

            // Chuẩn hóa tên file (không bao gồm đuôi)
            const baseName = path.basename(decodedOriginalName, ext)
                .normalize("NFKD")                          // Tách dấu ra khỏi ký tự
                .replace(/[\u0300-\u036f]/g, '')            // Xóa dấu tiếng Việt
                .replace(/[^\w\s.-]/g, '')                  // Loại bỏ ký tự đặc biệt (trừ khoảng trắng, dấu chấm, gạch ngang)
                .trim()                                     // Xóa khoảng trắng đầu cuối
                .replace(/\s+/g, '_');                      // Thay khoảng trắng bằng _

            // Tên file chuẩn hóa
            const fileName = `${uuidv4()}-${baseName}${ext}`;

            // Upload lên Supabase
            const { data, error: uploadError } = await supabase
                .storage
                .from(process.env.SUPABASE_BUCKET)
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false,
                });

            if (uploadError) {
                return res.status(400).json({ message: 'Upload failed', error: uploadError.message });
            }

            // Lấy public URL
            const { data: publicUrlData } = supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .getPublicUrl(fileName);

            // Lưu vào MongoDB
            const newAttachment = {
                name: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                url: publicUrlData.publicUrl,
                bucket: process.env.SUPABASE_BUCKET,
                path: fileName,
                cardId: new mongoose.Types.ObjectId(cardId),
                uploadedBy: new mongoose.Types.ObjectId(userId),
            };

            try {
                await createAttachmentService(newAttachment);
            } catch (mongoError) {
                console.error('MongoDB save error:', mongoError);

                // Xóa file trên Supabase nếu lưu vào MongoDB thất bại
                const { error: deleteError } = await supabase
                    .storage
                    .from(process.env.SUPABASE_BUCKET)
                    .remove([fileName]);

                if (deleteError) {
                    console.error('Failed to delete file from Supabase:', deleteError);
                } else {
                    console.log(`File ${fileName} deleted from Supabase due to MongoDB save failure`);
                }
                return res.status(500).json({ message: 'Failed to save attachment to database', error: mongoError.message });
            }

            res.status(201).json({ message: 'Uploaded', data: newAttachment });
        }catch (error) {
            // console.log(error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    async deleteAttachment(req, res) {
        try {
            const { _id } = req.query;
            if (!_id)
                return res.status(400).json({message: "Attachment ID is required"});

            const attachment = await getAttachmentByIdService(_id);
            if (!attachment)
                return res.status(400).json({message: "Attachment not found"});

            const { bucket, path } = attachment;

            // Xóa file từ Supabase storage
            const { error: storageError } = await supabase
                .storage
                .from(bucket)
                .remove([path]);

            if (storageError) {
                return res.status(400).json({
                    message: "Error deleting file from storage",
                    error: storageError.message
                });
            }

            // Xóa record từ database
            await deleteAttachmentService(_id);

            return res.status(200).json({
                message: "Attachment deleted successfully",
            });

        } catch (e) {
            console.error("Delete attachment error:", e);
            res.status(500).json({message: "Internal Server Error"});
        }
    }
}

module.exports = new AttachmentController();
