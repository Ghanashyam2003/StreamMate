import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
    user_id: {type: String},
    meetingCode: {type: String, required: true},
    meetingName: {type: String, required: true},
    date: {type: Date, required: true , default: Date.now},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    meetingLink: {type: String, required: true},
})

const Meeting = mongoose.model("Meeting", meetingSchema);
export { Meeting };