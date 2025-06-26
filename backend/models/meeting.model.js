import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      trim: true
    },
    meetingCode: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt fields
  }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
// Exporting the model for use in other parts of the application