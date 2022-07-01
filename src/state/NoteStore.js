import { applyMiddleware, createStore } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import thunk from "redux-thunk";
import noteReducer from "./reducers";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
// import persistReducer from "redux-persist/es/persistReducer";

const persistConfig={
    key:'persist-store',
    storage
}

const persistedReducer=persistReducer(persistConfig,noteReducer);
export const noteInfoStore=createStore(persistedReducer,{},applyMiddleware(thunk));
export const persistorNote=persistStore(noteInfoStore);


// export default {store,persistor}