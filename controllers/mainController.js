const userModel = require("../models/userModel");
const emailHandler = require('../utils/email-handler.js');
require("dotenv").config();

async function saveformResponse(req, res, next) {
    const accessKey = req.params.accessKey;
    const obj = JSON.parse(JSON.stringify(req.body));
    user = await userModel.findOne({ "accessKey": accessKey });
    if (user) {
        //Sending mail to user
        emailHandler.sendSubmissionEmail({ 
            sitename: req.headers.origin,
            submission: obj,
            emailReceiver: "<"+user.email+">"
        });
        //Saving totsl number of reponse in database
        user.totalSubmission = user.totalSubmission + 1;
        await user.save();
        if(req.headers.referer){
            res.status(200).redirect(req.headers.referer).send();
        } else {
            res.status(200).send();
        }
    }
    else { 
        res.status(404).send();
    }
}

module.exports = {
    saveformResponse
};