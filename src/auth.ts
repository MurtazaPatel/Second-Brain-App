import jwt, {  JwtPayload, Secret } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
const secret = process.env.JWT_USER_SECRET as Secret;

export interface CustomRequest extends Request{
    username?: string
} 

interface CustomPayload extends JwtPayload {
    username: string
}

async function auth(req: CustomRequest, res: Response) {
    const token = req.headers.authorization;
    if (!token) {
        res.status(403).json({
            msg: "You don't have a user Account yet, please signUp!!"
        })
        throw new Error("❌ token is not defined")
    } else {
        const result = jwt.verify(token, secret, (err, decoded) => { 
            if(err){
                res.status(403).json({
                    msg:"Unauthorized!!",
                    error:err.message
                })
            }
            else if(!decoded){
                throw new Error("❌ Decoded token is not defined");
            }
            else{
                const data = decoded as CustomPayload;
                req.username = data.username;
            }
        });
    }
} 

export default auth;