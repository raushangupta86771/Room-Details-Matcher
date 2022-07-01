import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import noteContext from "../context/notes/noteContext";
// import AddNote from './AddNote';
import UserDisplay from './UserDisplay';
import axios from 'axios';

const Login = () => {
    let history = useHistory();
    const context = useContext(noteContext);
    const [note, setNote] = useState({ email: "", password: "" });
    const [image, setImage] = useState('');
    const [resData, setResData] = useState([]);
    const [imgDecode, setImgDecode] = useState('');

    const handleClick = async (e) => {
        e.preventDefault(); //protecting page to not reload while clicking on submit button
        const url = "http://localhost:5000/api/auth/log";
        const formData = new FormData();
        formData.append('email', note.email);
        formData.append('password', note.password);
        try {
            const response = await axios({
                method: "post",
                url: url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then((res) => {
                if (res.data.success === true) {
                    alert("logged in...");
                    const base64String = btoa(
                        String.fromCharCode(...new Uint8Array((res.data.data.image.data.data)))
                    );
                    setImgDecode(base64String);
                    localStorage.setItem('token', res.data.authToken);
                    history.push("/");
                    document.location.reload();
                    setTimeout(()=>{
                        localStorage.removeItem('token');
                    },1000*60*10); //automatically logout after 10 minutes
                }
                else {
                    alert("failed ...");
                }
            }).catch((e) => console.log(e))
        } catch (error) {
            console.log(error)
        }
    }

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <>
            <form>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">email</label>
                    <input type="email" className="form-control" onChange={onchange} id="email" name='email' />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">password</label>
                    <input type="password" className="form-control" onChange={onchange} id="password" name='password' />
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleClick} encType="multipart/form-data">Submit</button>
            </form>



            <div id='resultID' className='row my-3'>
                {
                    imgDecode.length != 0 ? <UserDisplay img={`data:image/png;base64,${imgDecode}`} /> : console.log(imgDecode.length)
                }
            </div>
        </>
    )
}

export default Login;