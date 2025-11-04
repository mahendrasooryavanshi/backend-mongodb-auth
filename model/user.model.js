const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");



const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            minlength: 2,
            maxlength: 50,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
            sparse: true, // ✅ Prevent duplicate null error
        },
        mobile: {
            type: String,
            required: [true, "Mobile number is required"],
            unique: true,
            trim: true,
            match: [/^[0-9]{10}$/, "Invalid mobile number"],
            sparse: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false, // ✅ Never return password
        },
        role: {
            type: String,
            enum: ["user", "admin", "superadmin"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: Date,
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => {
                delete ret._id;   // remove original _id
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// compound index (fast lookup for login via email/mobile)
userSchema.index({ email: 1, mobile: 1 });


// Password Hashing Middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = mongoose.model("User", userSchema);
module.exports = { User };
