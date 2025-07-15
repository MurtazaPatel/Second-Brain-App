import { Router } from "express";
import z from "zod";
import bcrypt from "bcrypt"
import { userModel } from '../db'
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import { request } from "http";
dotenv.config({ path: './.env' })
const secret = process.env.JWT_USER_SECRET;
if (!secret) {
    throw new Error("❌ JWT_USER_SECRET is not defined in the .env file");

}

const UserRouter = Router();

UserRouter.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        const Schema = z.object({
            username: z.string()
                .min(3, "Username must contain more than 3 characters!!")
                .max(10, "Username should contain less than 10 characters!!"),
            password: z.string()
                .min(8, "Password must contain more than 8 characters!!")
                .max(20, "Password should contain less than 20 characters!!")
                .regex(/[A-Z]/, "Password must contain atleast one uppercase letter!!")
                .regex(/[a-z]/, "Password must contain atleast one lowercase letter!!")
                .regex(/[0-9]/, "Password must contain atleast one number!!")
                .regex(/[^A-Za-z0-9]/, "Password must contain atleast one special character!!"),
        })

        const result = Schema.safeParse({
            username: username,
            password: password
        });

        if (result.success) {
            const passHash = await bcrypt.hash(password, 10);
            const user = await userModel.findOne({ username: username });
            if (user) {
                res.status(403).json({
                    error: "User with the given Username already exists, please signin!!"
                })
            }
            else {
                const user = await userModel.create({
                    username: username,
                    passwordHash: passHash
                });
                console.log(user)
                res.status(200).json({
                    msg: "New user created, Welcome " + username + " to Second Brain!!",
                    id:user._id
                })
            }
        } else {
            res.status(411).json({
                err: result.error.message
            })
        }

    } catch (error) {
        res.status(500).json({
            msg: "Server Error!!!"
            , error: error
        })
    }

})

UserRouter.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({
            username: username,
        });

        if (user) {
            console.log("start");
            await bcrypt.compare(password, user.passwordHash).then(() => {
                console.log("end")
                const token = jwt.sign({ username: username }, secret, { expiresIn: "1h" });
                console.log({
                    user,
                    token
                });
                res.header("Authorization", `Bearer ${token}`);
                res.status(200).json({
                    msg: "User Signed in, Welcome back " + username + " !!",
                    token: token
                })
            }).catch((err) => {
                res.status(403).json({
                    msg: "Invalid username or password!!",
                    error:err
                })
            })
        } else {
            res.status(403).json({
                error: "Invalid username or password!!",
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error!!"
        })
    }
})

export default UserRouter ;