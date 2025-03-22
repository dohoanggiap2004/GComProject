const { getActivitiesInCardService, createActivityService} = require("../../../services/apiService/activityService");

class ActivityController {

    async getActivityByCardId(req, res) {
        try {
            if (!req?.params?._id)
                return res.status(400).json({ message: "Board id is required" });

            const id = req.params._id;
            const act = await getActivitiesInCardService(id);

            if (!act) {
                return res.status(200).json({ message: "Board not found" });
            }

            res.status(200).json({
                data: act,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async createActivity(req, res){
        try {
            if (!req?.body)
                return res.status(400).json({ message: "Board information is required" });

            const act = req.body;
            const newAct = await createActivityService(act);

            res.status(201).json({
                newAct: newAct,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = new ActivityController();
