import NoteContext from "./noteContext";
import { useState } from "react";
// import React from 'react'

const NoteState = (props) => {
    const host = "http://localhost:5000";
    const notesInitial = []; //initially all notes is empty. for getting all notes we will use getNotes();

    const [match, setMatches] = useState(notesInitial);
    //fetch all matching notes
    const matching = async (number,name,block,room,image) => {
        const response = await fetch(`${host}/api/notes/matchAndDisplay`, {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1YTlmODU1NWUzZmNhMmFkMjAxNzQ0In0sImlhdCI6MTY1MzM5NzY3MH0.hKL-2ThyKJwEvqYinL6wOue-96-v2o_8R1McKqml_3s"
            },
            body: JSON.stringify({ number,name,block,room,image }),
        });
        console.log("hello react side.........");
        alert("hello");
        const json = await response.json();
        console.log(json);
        setMatches(json);
    }

    return (
        <NoteContext.Provider value={{ matching, match }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState