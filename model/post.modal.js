const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            minlength: 2,
            maxlength: 100,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            lowercase: true,

        },
        files: [   //File attachments (can be image, video, pdf, docx, etc.)
            {
                url: { type: String },
                fileType: {
                    type: String,
                    enum: ["image", "video", "audio", "pdf", "doc", "other"],
                    default: "other",
                },
                fileName: { type: String },
                fileSize: { type: Number },
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0,
        },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => {
                delete ret._id;   // remove original _id
                delete ret.__v;
                delete ret.deletedAt;
                delete ret.deletedAt;
                delete ret.total_comments;
                delete ret.total_likes;
                return ret;
            },
        },
    }
);


const Post = mongoose.model("Post", postSchema);
module.exports = { Post };
