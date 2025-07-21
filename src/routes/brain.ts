import { NextFunction, Router, Response } from "express";
import auth, { CustomRequest } from "../auth";
import { contentModel, userModel } from "../db";
import { content, getUserId } from "./content";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config({ path: './.env' })
const shareSecret = process.env.JWT_SHARE_SECRET;
if (!shareSecret) {
    throw new Error("Share secret is not defined in the env file!!");
}
const brainRouter = Router();

brainRouter.use((req: CustomRequest, res: Response, next: NextFunction) => {
    auth(req, res);
    next();
})

brainRouter.post('/share', async (req: CustomRequest, res) => {

    try {
        const userId = (await getUserId(req)).toString();
        const user = await userModel.findById({
            _id: userId
        })
        const userIdToken = jwt.sign({ userId }, shareSecret, { expiresIn: "2h" });

        const share: boolean = req.body.share;

        if (share) {
            const shareLink = (req.username) as string + (user?.shareId) as string;
            console.log("ShareLink made successfully....")
            res.json({
                link: shareLink
            })
        }
        else {
            res.status(403).json({
                msg: "Oops, something went wrong!!!"
            })
        }
    } catch (error) {
        const err: string = error as string;
        res.status(400).json(
            {
                msg: "Internal Server error !!",
                error
            }
        )
    }
})

brainRouter.get('/:shareLink', async (req: CustomRequest, res) => {
    const shareLink = req.params.shareLink;
    const sharedUserShareId = shareLink.slice(-16);
    const checkUser = await userModel.findOne({
        shareId: sharedUserShareId
    });

    if (!checkUser) {
        res.status(403).json({
            msg: "The share link is invalid or sharing is disabled !!"
        })
    }

    const SharedUserContent: content[] = await contentModel.find({
        userId: checkUser?._id
    }).populate('tags', 'title').lean<content[]>();




    res.json({
        owner: checkUser?.username,
        SharedUserContent
    })

})

export default brainRouter;