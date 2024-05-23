import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
        description: {
			type: String,
			required: true,
		},
        user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null
		}
	},
	{ timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;