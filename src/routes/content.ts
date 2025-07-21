import { NextFunction, Router } from "express";
import { contentModel, linkModel, tagModel, userModel } from "../db";
import auth from "../auth";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import z from "zod"
import mongoose from "mongoose";
const contentRouter = Router();

type customTag = {
    _id: mongoose.Types.ObjectId | string;
    title: string
}

type content = {
    _id: mongoose.Types.ObjectId | string;
    type: string;
    link: string;
    title: string;
    tags: customTag[];
    tagTitles: string[],

}

interface CustomRequest extends Request {
    username?: string
}


contentRouter.use((req: CustomRequest, res: Response, next: NextFunction) => {
    auth(req, res);
    next();
})

contentRouter.post('/', async (req: CustomRequest, res) => {

    const newContent: content = req.body;

    const Schema = z.object({
        type: z.enum(['image', 'video', 'article', 'audio', 'tweet', 'InstaReel', 'InstaPost'], "Enter a valid content type !!"),
        title: z.string(),
        link: z.string(),
        tags: z.array(z.string()).nonempty(),

    })

    const check = Schema.safeParse(newContent);

    if (check.success) {

        //getting userId
        console.log("getting userId....")
        const userId = await getUserId(req);
        console.log("Fetched userId successfully.....")

        //Check for tags
        console.log("validating tags....")
        const Tags = await ValidateTags(req);
        console.log("Validated tags successfully.....")

        //check for link and create NewContent
        console.log("validating link....")
        let ValidatedLink = await ValidateLink(newContent, userId.toString());
        console.log("Validated link successfully.....")

        if (!ValidatedLink) {
            //check for remaining properties
            console.log("checking for remaining properties.....")
            const result: content[] = await contentModel.find({
                type: newContent.type,
                title: newContent.title,
                userId: userId
            });

            if (result.length > 1) { ///////
                console.log("content matched, returning error......")
                res.status(403).json({
                    msg: req.username + ", Similar content already exists !! "
                })
            } else {

                const content = await contentModel.create({
                    type: newContent.type,
                    title: newContent.title,
                    link: newContent.link,
                    tags: Tags,
                    userId
                })
                console.log(content);

                res.json({
                    msg: "New content added!!",
                    content,
                    owner: req.username
                })
            }
        } else {
            console.log("Link Check gone wrong.....")
            res.status(403).json({
                error: "Similar Content(Link) Exists!!"
            })
        }


    } else {
        res.status(400).json({
            error: check.error
        })
    }
})

async function getUserId(req: CustomRequest) {
    const user = await userModel.findOne({ username: req.username });
    if (!user) {
        throw new Error("No user with given credentials exist, Unauthorized!!");
    }
    return user._id;
}

async function ValidateTags(req: CustomRequest) {
    const newContent = req.body;
    const Tags = await Promise.all(newContent.tags.map(async (tag: string) => {
        const exists = await tagModel.findOne({ title: tag });
        if (!exists) {
            const newTag = await tagModel.create({
                title: tag
            })
            return newTag._id.toString();
        }
        else {
            return exists._id.toString();
        }
    }));
    return Tags;

}

async function ValidateLink(newContent: content, userId: string) {
    let linkMatches: boolean[] = [];
    const Links = await linkModel.find({
        userId
    })
    if (Links.length == 0) {
        const linkHash = await bcrypt.hash(newContent.link, 10);
        await linkModel.create({
            hash: linkHash,
            userId
        })
        return false;
    }
    else {
        linkMatches = await Promise.all(Links.map(async (Link) => {
            if (!Link.hash) {
                throw new Error("Link hash is undefined !!");
            }
            else {
                const linkMatch = await bcrypt.compare(newContent.link, Link.hash);
                if (linkMatch) {
                    return true;
                }
                else {
                    const HashedLink = await bcrypt.hash(newContent.link, 10);
                    await linkModel.create({
                        hash: HashedLink,
                        userId
                    })
                    return false
                }
            }
        }))


    }
    if (linkMatches.includes(true))
        return true;
    else return false;

}


contentRouter.get('/', async (req: CustomRequest, res) => {
    try {
        const user = await userModel.findOne({
            username: req.username
        })
        console.log("user fetched.....")
        if (!user) {
            res.status(403).json({
                msg: "No user found, please signup!!"
            })
            throw new Error("No such user exists, please signup!!");

        }
        const userId = user._id;

        console.log("fetching contents....")
        const contents = await contentModel.find({
            userId
        }).populate('tags', 'title');
        console.log("contents fetched successfully....")

        res.json({
            user: user.username,
            contents
        })
    } catch (error) {
        res.status(511).json({
            msg: "Something went wrong while fetching all contents!!",
            error: error as string
        })
    }

})

contentRouter.delete('/', async (req: CustomRequest, res) => {
    console.log(req.body)
    const contentId: mongoose.Types.ObjectId = req.body.contentId;
    const check = await userModel.find({
        username: req.username
    })
    const content = await contentModel.findById(
        contentId
    )

    if (check != content?.userId) {
        res.status(403).json({
            msg: "Ooops, trying to delete a doc you don't own?!"
        })
    }
    await contentModel.deleteOne({ _id: contentId })
    res.json({
        msg: "Delete Succeeded !!"
    })

})

export { contentRouter, getUserId, content };


/* content type
 {
        "type": "document" | "tweet" | "youtube" | "link",
        "link": "url",
        "title": "Title of doc/video",
        "tags": ["productivity", "politics", ...]
    }
*/