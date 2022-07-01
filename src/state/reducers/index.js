import { combineReducers } from "redux";
import imgReducer from "./imgReducer";
import noteReducer from "./noteReducer";


const reducers=combineReducers({
    imgData : imgReducer,
    noteInfo : noteReducer
})

export default reducers
