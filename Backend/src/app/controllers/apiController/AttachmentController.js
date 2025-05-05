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

class AttachmentController {
    async getAttachmentsByCardId(req, res) {
        try {
            const cardId = req.params.cardId;
            if (!cardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Card ID is required"
                });
            }

            const attachments = await getAttachmentsByCardIdService(cardId);
            if (!attachments) {
                return res.status(404).json({
                    error: 1,
                    message: "Attachment not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: attachments,
                message: "Attachments retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async uploadAttachment(req, res) {
        try {
            const file = req.file;
            const { cardId } = req.body;
            const userId = await getUserIdFromToken(req);

            if (!userId || !file || !cardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Uploader id, file, cardID is required"
                });
            }

            const ext = path.extname(file.originalname);
            const decodedOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const baseName = path.basename(decodedOriginalName, ext)
                .normalize("NFKD")
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^\w\s.-]/g, '')
                .trim()
                .replace(/\s+/g, '_');
            const fileName = `${uuidv4()}-${baseName}${ext}`;

            const { data, error: uploadError } = await supabase
                .storage
                .from(process.env.SUPABASE_BUCKET)
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false,
                });

            if (uploadError) {
                return res.status(400).json({
                    error: 1,
                    message: 'Upload failed',
                    details: uploadError.message
                });
            }

            const { data: publicUrlData } = supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .getPublicUrl(fileName);

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
                const { error: deleteError } = await supabase
                    .storage
                    .from(process.env.SUPABASE_BUCKET)
                    .remove([fileName]);

                return res.status(500).json({
                    error: 1,
                    message: 'Failed to save attachment to database',
                    details: mongoError.message
                });
            }

            return res.status(201).json({
                error: 0,
                data: newAttachment,
                message: 'Attachment uploaded successfully'
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async deleteAttachment(req, res) {
        try {
            const { _id } = req.query;
            if (!_id) {
                return res.status(400).json({
                    error: 1,
                    message: "Attachment ID is required"
                });
            }

            const attachment = await getAttachmentByIdService(_id);
            if (!attachment) {
                return res.status(404).json({
                    error: 1,
                    message: "Attachment not found"
                });
            }

            const { bucket, path } = attachment;
            const { error: storageError } = await supabase
                .storage
                .from(bucket)
                .remove([path]);

            if (storageError) {
                return res.status(400).json({
                    error: 1,
                    message: "Error deleting file from storage",
                    details: storageError.message
                });
            }

            await deleteAttachmentService(_id);

            return res.status(200).json({
                error: 0,
                message: "Attachment deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new AttachmentController();
