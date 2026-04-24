import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // Password is not required if the user signs up with Google
    },
    googleId: {
        type: String,
    },
    caregiverName: String,
    caregiverEmail: String,
    caregiverRelation: String
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
