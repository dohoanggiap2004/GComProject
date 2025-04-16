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
    //             return res.status(200).json({message: "Webhook not found"});
    //         }
    //
    //         res.status(200).json({
    //             data: webhooks,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({message: "Internal Server Error"});
    //     }
    // }

    // async createWebhook(req, res) {
    //     try {
    //         if (!req?.body)
    //             return res.status(400).json({message: "Webhook information is required"});
    //
    //         const webhook = req.body;
    //         const newWebhook = await createWebhookService(webhook);
    //         res.status(201).json({
    //             newWebhook: newWebhook,
    //         });
    //
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({message: "Internal Server Error"});
    //     }
    // }

    // async updateWebhook(req, res) {
    //     try {
    //         if (!req?.body)
    //             return res.status(400).json({message: "Webhook information is required"});
    //         const webhook = req.body;
    //         const result = await updateWebhookService(webhook);
    //
    //         if (!result) return res.status(200).json({message: "No webhook changed"});
    //
    //         res.status(200).json({
    //             rowsEffected: result,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({message: "Internal Server Error"});
    //     }
    // }

    // async deleteWebhook(req, res) {
    //     try {
    //         if (!req?.query)
    //             return res.status(400).json({message: "Webhook information is required"});
    //         const {_id} = req.query;
    //         const result = await deleteWebhookService(_id);
    //         if (!result) return res.status(200).json({message: "No webhook be deleted"});
    //
    //         res.status(200).json({
    //             rowsEffected: result,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({message: "Internal Server Error"});
    //     }
    // }
}

module.exports = new WebhookController();
