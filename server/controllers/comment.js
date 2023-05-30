import { createError } from '../error.js'
import Comment from '../models/comment.js'
import Video from '../models/video.js'

export const addComment=async(req,res,next)=>{
    const newComment=new Comment({...req.body,userId:req.user.id})
    try {
        await newComment.save()
        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}
export const deleteComment=async(req,res,next)=>{
    try {
        const comment=await Comment.findById(req.params.id)
        const video = await Video.findById(req.params.id)
        if(req.user.id===comment.userId || req.user.id===video.userId){
            await Comment.findByIdAndDelete(req.params.id)
            return res.status(200).json("comment deleted")
        }
        return next(createError(403,"you are not allowed to delete it"))
    } catch (error) {
        next(error)
    }
}
export const getComment=async(req,res,next)=>{
    try {
        const comment= await Comment.find({ videoId: req.params.videoId})
        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}