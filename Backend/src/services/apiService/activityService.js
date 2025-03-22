const Activity = require('../../app/models/Activity');

const getActivitiesInCardService = async (cardId) => {
    return Activity.find({cardId}).sort({timestamp: -1}).lean();
};

const createActivityService = async (act) => {
    const newAct = new Activity(act);
    return newAct.save();
}

module.exports = { createActivityService, getActivitiesInCardService }
