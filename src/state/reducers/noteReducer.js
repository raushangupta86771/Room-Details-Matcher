//ye image ke saath khilwaar karega

const reducer = (state = "", action) => {
    if (action.type === 'noteInfo') {
        return action.payload;
    }
    else {
        return state;
    }
}

export default reducer