import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import noteContext from "../context/notes/noteContext";
// import AddNote from './AddNote';
// import NoteItem from './NoteItem';
import axios from 'axios';
import DisplayMatches from './DisplayMatches';
import NoMatch from './NoMatch';
import Navbar from './Navbar';
import { actionCreaters } from '../state';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import storeNoteInfo  from '../state/action-creater/index'

const Notes = () => {
  const dispatch = useDispatch();

  const context = useContext(noteContext);
  const { matching, match } = context;
  const [block, setBlockVal] = useState("D");
  const [note, setNote] = useState({ email: "", name: "", block: "", room: "" });
  const [image, setImage] = useState('');
  const [matchData, setMatchData] = useState([]);
  const [count, setCount] = useState(0);
  const [message, setMsg] = useState("");

  const handleClick = async (e) => {
    e.preventDefault(); //protecting page to not reload while clicking on submit button
    const url = "http://localhost:5000/api/notes/matchAndDisplay";
    const formData = new FormData();
    formData.append('email', note.email);
    formData.append('name', note.name);
    formData.append('block', block);
    formData.append('room', note.room);
    formData.append('image', image);
    var resData = []
    console.log(formData);
    try {
      const response = await axios({
        method: "post",
        url: url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data", "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1YTlmODU1NWUzZmNhMmFkMjAxNzQ0In0sImlhdCI6MTY1MzM5NzY3MH0.hKL-2ThyKJwEvqYinL6wOue-96-v2o_8R1McKqml_3s" },
      }).then((res) => {
        setCount(1);
        if (res.data.success === true) {
          setMatchData(res.data.data);
          console.log(typeof (res.data.savedData));;//id of saved note which we entered
          dispatch(actionCreaters.storeNoteInfo(8));
        }
        else if (res.data.success === false && res.data.count === 1) {
          console.log(typeof (res.data.savedData._id));
          dispatch(actionCreaters.storeNoteInfo(6));
        }
      }).catch((e) => console.log(e))
    } catch (error) {
      console.log(error)
    }
  }

  const onchange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const imgOnChng = (e) => {
    // console.log(e.target.files);
    setImage(e.target.files[0]);
  }

  return (
    <>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" onChange={onchange} name="email" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Name</label>
          <input type="text" className="form-control" onChange={onchange} id="name" name='name' />
        </div>
        <div className="form-group my-2">
          <label htmlFor="med">Block Name</label>
          <select name="block" id="block" className='mx-2' onChange={(e) => { setBlockVal(e.target.value) }}>
            <option value="L">L block</option>
            <option value="D">D-ANNEX</option>
            <option value="Q">Q Block</option>
          </select><br />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Room Number</label>
          <input type="number" className="form-control" onChange={onchange} id="room" name="room" />
        </div>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">Your Image</label>
          <input className="form-control" accept="image/png, image/jpeg" type="file" id="image" name="image" onChange={imgOnChng} />
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleClick} encType="multipart/form-data">Submit</button>
      </form>



      <div id='resultID' className='row my-3'>
        <div className="container mx-2">
          {matchData.length === 0 && count === 1 && <NoMatch />}
        </div>
        {
          matchData.map((currEle) => {
            //converting binary into image
            const base64String = btoa(
              String.fromCharCode(...new Uint8Array((currEle.image.data.data)))
            );
            return <DisplayMatches key={currEle._id} imgSrc={`data:image/png;base64,${base64String}`} name={currEle.name} />
          })
        }
      </div>
    </>
  )
}

export default Notes;