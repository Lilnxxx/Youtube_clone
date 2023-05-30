import { createError } from "../error.js"
import User from "../models/User.js"
import Video from "../models/video.js"

export const update= async (req,res,next)=>{
    if(req.params.id===req.user.id){
        try {
            const updateUser= await User.findByIdAndUpdate(req.params.id,
                {$set:req.body},
                {new:true})
            res.status(200).json(updateUser)
        } catch (error) {
            next(error)
        }

    }else{
        return next(createError(403,"Can't update other users acc"))
    }
}
export const deleteUser= async (req,res,next)=>{

    if(req.params.id===req.user.id){
        try {
            await User.findByIdAndDelete(req.params.id,)
            res.status(200).json("Deleted User")
        } catch (error) {
            next(error)
        }

    }else{
        return next(createError(403,"Can't delete other users acc"))
    }
}
export const getUser=async (req,res,next)=>{
    try {
        // console.log(req.params.id) 
        const usr= await User.findById(req.params.id)
        if(!usr)return next(createError(203,"user not found"))
        res.status(200).json(usr)
    } catch (error) {
        next(error)
    }
}
export const subscribe=async (req,res,next)=>{
    try {
        console.log("subs "+req.user.id)
        await User.findByIdAndUpdate(req.user.id,{
            $push: { subscribedUsers: req.params.id}
        })
        
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{suscribers:1}
        })
        res.status(200).json("subscribed")
    } catch (error) {
        next(error)
    }
}
export const unsubscribe=async(req,res,next)=>{
    console.log("in unsub")
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $pull:{subscribedUsers:req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{suscribers:-1}
        })
        res.status(200).json("Unsubscribed")
    } catch (error) {
        next(error)
    }
}
export const like=async(req,res,next)=>{
    const id = req.user.id;
    const videoId= req.params.id
    // console.log(id)
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{likes:id},
            $pull:{disLikes:id}
        })
        // console.log(req.params)
        res.status(200).json("liked")
    } catch (error) {
        next(error)
    }
}
export const dislike=async(req,res,next)=>{
    const id = req.user.id;
    const videoId= req.params.id
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{disLikes:id},
            $pull:{likes:id}
        })
        res.status(200).json("duhh disLiked vid")
    } catch (error) {
        next(error)
    }    
}