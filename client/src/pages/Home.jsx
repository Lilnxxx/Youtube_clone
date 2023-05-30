import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from 'axios'
import {store} from '../redux/store'
import SignIn from "./SignIn";
import { BrowserRouter,Routes,Route} from "react-router-dom";



const Container = styled.div`
  display: flex;
  justify-content:space-between;
  /* justify-content: space-around; */
  /* margin-left: 30%; */
  flex-wrap: wrap;
`;
const Showres=styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items:center;
  margin:240px;
  color: ${({ theme }) => theme.text};
`;

const Home = ({type}) => {
  const [videos,setVideos]=useState([])
  useEffect(()=>{
    const fetchVideos=async()=>{
      const res=await axios.get(`/videos/${type}`)
      setVideos(res.data)
    }
    fetchVideos()
  },[type])
  // if(store.getState().user.currentUser)
  //   console.log("user is here\n")
  // else console.log("sorry no user found") 
  if(store.getState().user.currentUser==null&&type==='sub')
  return(
    <Showres>
      <h1>
    Please Login to view this page
      </h1>
    </Showres>
  )
  return (
    <Container>
      {videos.map(video=>(
        <Card key={video._id} video={video}/> 
      ))}
      
    </Container>
  );
};

export default Home;
