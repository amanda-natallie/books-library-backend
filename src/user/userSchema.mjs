import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: String,
    token: {
        type: String,
        select: false,
    },
    refresh_token: {
        type: String,
        select: false,
    },
    email: {
        type: String,
        required: [true, "the email field is required"],
        unique: [true, "the email you choose is already registered"],
    },
    firstName: String,
    lastName: String,
    profilePhoto: String,
    password: String,
    lastVisited: { type: Date, default: new Date() },
    created_at: { type: Date, default: new Date() },
});

export default mongoose.model('User', userSchema);