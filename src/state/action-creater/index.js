export const updateNavImg=(data)=>{
    return (dispatch)=>{
        dispatch({
            type:'imgUpdate',
            payload:data
        })
    }
}

export const storeNoteInfo=(data)=>{
    console.log(data);
    return (dispatch)=>{
        dispatch({
            type:'noteInfo',
            payload:data
        })
    }
}
