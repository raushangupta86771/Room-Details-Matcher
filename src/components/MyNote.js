import React from 'react'
import { useSelector } from 'react-redux/es/exports';
import {storeNoteInfo} from '../state/action-creater/index'

const MyNote = () => {

    const noteInfo = useSelector(state => state.storeNoteInfo);
    console.log(noteInfo)

  return (
    <>
        <h1>{storeNoteInfo}</h1>
    </>
  )
}

export default MyNote