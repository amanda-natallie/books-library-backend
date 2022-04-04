import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookSchema = new Schema({
    _id: String,
    name: String,
    image: String,
    description: String,
    booked: Boolean,
    bookedBy: {
        type: Object,
        ref: 'User'
    },
    created_at: { type: Date, default: new Date() },
});

export default mongoose.model('Book', bookSchema);