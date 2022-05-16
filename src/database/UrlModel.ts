import mongoose from "mongoose";

// 1. Create an interface representing a document in MongoDB.
const urlSchema = new mongoose.Schema(
	{
		id: mongoose.Types.ObjectId,
		video: String,
		picture: String,
		hex:String,
		title:String,
		key: {
			type: String,
			unique: true,
			required: true,
		},
		count: { type: Number, default: 0 },
	},
	{ strict: true }
);

export { urlSchema };

export const UrlModel = mongoose.model("url", urlSchema);
