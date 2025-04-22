const Attachment = require("../../app/models/Attachment");

const getAllAttachmentsService = () => {
    return Attachment.find().lean()
}

const getAttachmentByIdService = (attachmentId) => {
    return Attachment.findById(attachmentId).lean()
}

const getAttachmentsByCardIdService = (cardId) => {
    return Attachment.find({cardId}).lean()
}

const createAttachmentService = (attachment) => {
    const newAttachment = new Attachment(attachment);
    return newAttachment.save();
}

const deleteAttachmentService = (attachmentId) => {
    return Attachment.deleteOne({ _id: attachmentId })
}

module.exports = {
    createAttachmentService,
    getAllAttachmentsService,
    deleteAttachmentService,
    getAttachmentsByCardIdService,
    getAttachmentByIdService,

};
