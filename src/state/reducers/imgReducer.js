//ye image ke saath khilwaar karega

const reducer = (state = 2, action) => {
    if (action.type === 'imgUpdate') {
        return action.payload;
    }
    else if (action.type === 'noteInfo') {
        console.log(action.payload)
        return action.payload;
    }
    else {
        return state;
    }
}

export default reducer