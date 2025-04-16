const Webhook = require('../../app/models/Webhook')

// const getAllWebhooksService = async () => {
//     return Webhook.find().lean()
// }

const createWebhookService = async (webhook) => {
    const newWebhook = new Webhook(webhook)
    return await newWebhook.save()
}

// const updateWebhookService = async (webhook) => {
//     const {_id, updateFields} = webhook
//     return Webhook.findByIdAndUpdate(
//         _id,
//         {$set: updateFields},
//         {new: true}
//     ).lean()
// }

// const deleteWebhookService = async (webhookId) => {
//     return Webhook.deleteOne({
//         _id: webhookId
//     })
// }

module.exports = {
    createWebhookService,
    // updateWebhookService,
    // deleteWebhookService,
    // getAllWebhooksService
}
