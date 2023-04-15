import mongoose from "mongoose";
import { IGroup } from "./groups.interface";

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    managers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId
            },
            role: {
                type: String,
                enum: ['admin', 'mod'],
                default: 'admin'
            }
        }
    ],
    members: [
        {
            users: {
                type: mongoose.Schema.Types.ObjectId,
            },
            date: {
                type: Date,
                default: Date.now
            },
        }
    ],
    member_requests: [
        {
            users: {
                type: mongoose.Schema.Types.ObjectId,
            },
            date: {
                type: Date,
                default: Date.now
            },
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IGroup & mongoose.Document>("Group", GroupSchema);
