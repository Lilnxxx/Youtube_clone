import react, { useEffect, useState,useNavigate } from "react"
import styled from "styled-components"
import { getStorage, ref, urltype, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import app from '../firebase.js'
import axios from 'axios'

const Container=styled.div`
width:100%;
height:100%;
position:absolute;
top:0;
left:0;
background-color:#000000a7;
display:flex;
align-items:center;
justify-content:center;
`
const Wrapper=styled.div`
width:600px;
height:600px;
background-color:${({theme})=>theme.bgLighter};
color:${({theme})=>theme.text};
padding:20px;
display:flex;
flex-direction:column;
gap:20px;
position:relative;
`
const Close=styled.div`
position:absolute;
top:10px;
right:10px;
cursor:pointer;
`
const Title=styled.h1`text-align:center;`

const Input=styled.input`
border: 1px solid ${({theme})=>theme.soft};
color: ${({theme})=>theme.text};
border-radius:3px;
padding: 10px;
background-color: transparent;
`
const Desc=styled.textarea`
border: 1px solid ${({theme})=>theme.soft};
color: ${({theme})=>theme.text};
border-radius:3px;
padding: 10px;
background-color: transparent;
`
const Button = styled.button`
  padding: 10px 80px;
  background-color:  ${({theme})=>theme.soft};
  border: 1px solid #3ea6ff;
  color:  ${({theme})=>theme.textSoft};
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 40px;
  align-items: center;
`
const Label=styled.div`
    font-size: 14px;
`
export const Upload=({setOpen})=>{
    const [img,setImg]=useState(undefined)
    const [video,setVideo]=useState(undefined)
    const [imgper,setImgper]=useState(0)
    const [videoper,setVideoper]=useState(0)
    // const [title,setTitle]=useState("")
    // const [desc,setDesc]=useState("")
    const [inputs, setInputs] = useState({});
    const [tags,setTags]=useState([])
    const navigate=useNavigate   
    
    const handelChange=(e)=>{
        setInputs((prev)=>{
            return {...prev,[e.target.name]:e.target.value}
        })
    }

    const handelTags=(e)=>{
        setTags(e.target.value.split(","))
    }

    const uploadfile=(file,urltype)=>{
        const storage = getStorage(app)
        const fileName= new Date().getTime()+file.name
        const storageref=ref(storage,fileName)
        const uploadTask=uploadBytesResumable(storageref,file)

        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            urltype==="imgUrl"?setImgper(progress):setVideoper(progress)
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
                default:break
            }
        }, 
        (error) => {},
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setInputs((prev)=>{
                    return {...prev,[urltype]:downloadURL} 
                })
            });
        }
    )  
    }
    useEffect(()=>{
        video &&uploadfile(video,"videoUrl")
    },[video])
    useEffect(()=>{
        img &&uploadfile(img,"imgUrl")
    },[img])

    const handelUpload=async(e)=>{
        e.preventDefault();
        const res=await axios.post("/videos/",{...inputs,tags})
        setOpen(false)
        res.status===200 && navigate(`/videos/${res.data._id}`)
    }
    return(
        <Container>
            <Wrapper>
                <Close onClick={()=>setOpen(false)}>X</Close>
                <Title>Upload Video</Title>
                <Label>Video</Label>
                {videoper>0?("Uploading:"+Math.round(videoper)+"%"):(
                <Input type="file" accept="video/*" 
                onChange={e=>setVideo(e.target.files[0])}/>)}
                
                <Input type="text" placeholder="Title" name="title"
                onChange={handelChange}/>
                
                <Desc name="desc" placeholder="Description" rows={8} 
                onChange={handelChange}/>
                <Input  placeholder="Seperate tags with comma" 
                onChange={handelTags}/>
                <Label>Image</Label>
                {imgper>0?("Uploading:"+Math.round(imgper)+"%"):(
                <Input type="file" accept="image/*" 
                onChange={e=>setImg(e.target.files[0])}/>)}
                <Button onClick={handelUpload}>UPLOAD</Button>
            </Wrapper>
        </Container>
    )
}
