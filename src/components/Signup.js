import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import noteContext from "../context/notes/noteContext";
// import AddNote from './AddNote';
import UserDisplay from './UserDisplay';
import axios from 'axios';
import Navbar from './Navbar';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { actionCreaters } from '../state';

const Signup = () => {
  const dispatch = useDispatch();

  let history = useHistory();
  const context = useContext(noteContext);
  const [note, setNote] = useState({ name: "", email: "", password: "" });
  const [image, setImage] = useState('');
  const [resData, setResData] = useState([]);
  const [imgDecode, setImgDecode] = useState('');
  const [count, setCount] = useState(0);

  const handleClick = async (e) => {
    e.preventDefault(); //protecting page to not reload while clicking on submit button
    const url = "http://localhost:5000/api/auth/signup";
    if(!note.email)
    {
      alert("invalid email");
      return;
    }
    const formData = new FormData();
    formData.append('name', note.name);
    formData.append('email', note.email);
    formData.append('password', note.password);
    formData.append('image', image);
    try {
      const response = await axios({
        method: "post",
        url: url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        if (res.data.success != true) {
          alert("email already exist");
        }
        else {
          // alert(`your name is ${res.data.res_data.name}`);
          // setResData(res.data.res_data);
          setCount(1);
          const base64String = btoa(
            String.fromCharCode(...new Uint8Array((res.data.res_data.image.data.data)))
          );
          setImgDecode(base64String);
          localStorage.setItem('token', res.data.authToken);
          setTimeout(() => {
            localStorage.removeItem('token');
          }, 1000 * 60 * 10); //automatically logout after 10 minutes

          dispatch(actionCreaters.updateNavImg(`data:image/png;base64,${base64String}`));
          // if(base64String.length != 0){
          //  <Navbar img={`data:image/png;base64,${base64String}`} val={count} />
          //  } 
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
          <label htmlFor="exampleInputEmail1" className="form-label">name</label>
          <input type="text" className="form-control" id="name" onChange={onchange} name="name" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">email</label>
          <input type="email" className="form-control" onChange={onchange} id="email" name='email' />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">password</label>
          <input type="password" className="form-control" onChange={onchange} id="password" name='password' />
        </div>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">Your Image</label>
          <input className="form-control" accept="image/png, image/jpeg" type="file" id="image" name="image" onChange={imgOnChng} />
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleClick} encType="multipart/form-data">Submit</button>
      </form>



      <div id='resultID' className='row my-3'>

      </div>
    </>
  )
}

export default Signup;