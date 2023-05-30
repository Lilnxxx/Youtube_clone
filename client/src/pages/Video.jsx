import React, { useState,useEffect} from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbDownIcon from '@mui/icons-material/ThumbDownAlt'
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSuccess } from "../redux/videoSlice";
import axios from 'axios'
import {format} from 'timeago.js'
import {like ,dislike} from '../redux/videoSlice'
import { subscription } from "../redux/userSlice";

var subscolor="#cc1a00"
const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5.2;
`;
const VideoWrapper = styled.div`
flex:10;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Recommendation = styled.div`
  flex: 2;
`;
const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color:${subscolor};
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;
const VideoFrame=styled.video`
max-height:720px;
width:100%;
object-fit:cover;
`

const Video = () => {
  const {currentUser}=useSelector((state)=>state.user)
  const {currentVideo}=useSelector((state)=>state.video)
  const dispatch=useDispatch()

  const path=useParams().id
  const [channel,setChannel]=useState({})
  useEffect(()=>{console.log("inside use effect")
    const fetchData=async()=>{
      try {
        const videoRes=await axios.get(`/videos/${path}`)
        const channelRes=await axios.get(`/users/find/${videoRes.data.userId}`)

        setChannel(channelRes.data)
        dispatch(fetchSuccess(videoRes.data))
      } catch (error) {
        console.log("we have an error")
      }
    };
    fetchData();
  },[path,dispatch])

  const handelLike=async()=>{
      await axios.put(`/users/like/${currentVideo._id}`)
      dispatch(like(currentUser._id))
  }
  const handelDislike=async()=>{
    await axios.put(`/users/dislike/${currentVideo._id}`)
    dispatch(dislike(currentUser._id))
  }
  const handelsubscribe=async()=>{
    // console.log(currentUser.subscribedUsers)
    const x=currentUser.subscribedUsers.includes(channel._id)
    x?subscolor='red':subscolor='grey'
    x?await axios.put(`/users/unsub/${channel._id}`)
    :await axios.put(`/users/sub/${channel._id}`)
    dispatch(subscription(channel._id))
  }
  // console.log("current video ",currentVideo)
  if(!currentVideo)
  return (<h1>hi</h1>)
  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo.videoUrl} controls/>
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>{currentVideo.views} views • {format(currentVideo.createdAt)}</Info>
          <Buttons>
            <Button onClick={handelLike}>
              {currentVideo.likes?.includes(currentUser._id)?(<ThumbUpIcon/>):
              (<ThumbUpOutlinedIcon />)} 
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handelDislike}>
            {currentVideo.disLikes?.includes(currentUser._id)?(<ThumbDownIcon/>):
              <ThumbDownOffAltOutlinedIcon />}
              {currentVideo.disLikes?.length}
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.suscribers} subscribers</ChannelCounter>
              <Description>
              {channel.des}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handelsubscribe}> 
              {currentUser.subscribedUsers?.includes(channel._id)?
            " SUBSCRIBED ":"SUBSCRIBE"}</Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id}/>
      </Content>{}
    </Container>
  );
};

export default Video;
