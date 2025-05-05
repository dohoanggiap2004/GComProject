const { getActivitiesInCardService, createActivityService} = require("../../../services/apiService/activityService");

class ActivityController {

    async getActivityByCardId(req, res) {
        try {
            if (!req?.params?._id) {
                return res.status(400).json({
                    error: 1,
                    message: "BoardItem id is required"
                });
            }

            const id = req.params._id;
            const act = await getActivitiesInCardService(id);

            if (!act) {
                return res.status(200).json({
                    error: 1,
                    message: "BoardItem not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: act,
                message: "Activities retrieved successfully"
            });
        } catch (error) {
            // console.error(error);
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async createActivity(req, res) {
        try {
            if (!req?.body) {
                return res.status(400).json({
                    error: 1,
                    message: "BoardItem information is required"
                });
            }

            const act = req.body;
            const newAct = await createActivityService(act);

            return res.status(201).json({
                error: 0,
                data: newAct,
                message: "Activity created successfully"
            });

        } catch (error) {
            // console.error(error);
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new ActivityController();
