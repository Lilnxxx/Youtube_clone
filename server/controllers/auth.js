import mongoose from "mongoose"
import User from '../models/User.js'
import bcrypt from "bcrypt"
import { createError } from "../error.js"
import jwt from "jsonwebtoken"

export const signup= async(req,res,next)=>{
    console.log(req.body)
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password,salt)
        const newUser = new User({...req.body,password:hash})
        await newUser.save()
        res.status(200).send("user added")
    } catch (error) {
        next(error)
    }
}
export const signin= async(req,res,next)=>{
    // console.log(req.body)
    try {
        const user=await User.findOne({"name":req.body.name})
        if(!user) return next(createError(404,"User not found"))
        
        const isCorrect = await bcrypt.compare(req.body.password,user.password)
        // console.log(isCorrect)
        if(!isCorrect) return next(createError(400,"wrong passcode"))
        const token = jwt.sign({id:user._id},process.env.JWT)

        const {password,...others}= user._doc
        res.cookie("access_token",token,{
            httpOnly:true
        }).status(200).json(others)
    } catch (error) {
        next(error)
    }
}
export const signout= async(req,res,next)=>{
    console.log(req.body)
    try {
        res.cookie('access_token', 'none', {
            expires: new Date(Date.now() + 5 * 10),
            httpOnly: true,
        })
        res.status(200).json({ success: true, message: 'User logged out successfully' })
    } catch (error) {
        next(error)
    }
}