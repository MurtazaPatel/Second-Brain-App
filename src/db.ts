import { mongo, Schema } from "mongoose";
import mongoose from "mongoose";
import { required } from "zod/v4/core/util.cjs";
const ObjectId = mongoose.Types.ObjectId;


const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    shareId : {type: String , required:true}
})

const ContentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, required: true, enum: ['image', 'video', 'article', 'audio', 'tweet', 'InstaReel', 'InstaPost'] },
    title: { type: String, required: true },
    tags: [{ type: ObjectId, ref: "tags" }],
    userId: {
        type: ObjectId,
        ref: "users"
    },
    tagTitles : [{type: String}]
})

const TagsSchema = new Schema({
    title: { type: String, required: true }
})

const LinkSchema = new Schema({
    hash: { type: String },
    userId: { type: ObjectId, ref: "users" }
})


const userModel = mongoose.model("users", UserSchema);
const contentModel = mongoose.model("contents", ContentSchema);
const tagModel = mongoose.model("tags", TagsSchema);
const linkModel = mongoose.model("links", LinkSchema);


export { userModel, contentModel, tagModel, linkModel }