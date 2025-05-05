const {
    createWebhookService,
    updateWebhookService,
    deleteWebhookService,
    getAllWebhooksService,
} = require("../../../services/apiService/webhookService");

class WebhookController {
    // async getWebhooks(req, res) {
    //     try {
    //         const webhooks = await getAllWebhooksService();
    //         if (!webhooks) {
    //             return res.status(404).json({
    //                 error: 1,
    //                 message: "Webhooks not found"
    //             });
    //         }
    //
    //         return res.status(200).json({
    //             error: 0,
    //             data: webhooks,
    //             message: "Webhooks retrieved successfully"
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             error: 1,
    //             message: "Internal Server Error"
    //         });
    //     }
    // }
    //
    // async createWebhook(req, res) {
    //     try {
    //         if (!req?.body) {
    //             return res.status(400).json({
    //                 error: 1,
    //                 message: "Webhook information is required"
    //             });
    //         }
    //
    //         const webhook = req.body;
    //         const newWebhook = await createWebhookService(webhook);
    //
    //         return res.status(201).json({
    //             error: 0,
    //             data: newWebhook,
    //             message: "Webhook created successfully"
    //         });
    //
    //     } catch (error) {
    //         return res.status(500).json({
    //             error: 1,
    //             message: "Internal Server Error"
    //         });
    //     }
    // }
    //
    // async updateWebhook(req, res) {
    //     try {
    //         if (!req?.body) {
    //             return res.status(400).json({
    //                 error: 1,
    //                 message: "Webhook information is required"
    //             });
    //         }
    //
    //         const webhook = req.body;
    //         const result = await updateWebhookService(webhook);
    //
    //         if (!result) {
    //             return res.status(404).json({
    //                 error: 1,
    //                 message: "Webhook not found"
    //             });
    //         }
    //
    //         return res.status(200).json({
    //             error: 0,
    //             data: result,
    //             message: "Webhook updated successfully"
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             error: 1,
    //             message: "Internal Server Error"
    //         });
    //     }
    // }
    //
    // async deleteWebhook(req, res) {
    //     try {
    //         if (!req?.query?._id) {
    //             return res.status(400).json({
    //                 error: 1,
    //                 message: "Webhook ID is required"
    //             });
    //         }
    //
    //         const { _id } = req.query;
    //         const result = await deleteWebhookService(_id);
    //
    //         if (!result) {
    //             return res.status(404).json({
    //                 error: 1,
    //                 message: "Webhook not found"
    //             });
    //         }
    //
    //         return res.status(200).json({
    //             error: 0,
    //             data: result,
    //             message: "Webhook deleted successfully"
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             error: 1,
    //             message: "Internal Server Error"
    //         });
    //     }
    // }
}

module.exports = new WebhookController();
