import { applyMiddleware, createStore } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import thunk from "redux-thunk";
import reducers from "./reducers/index";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
// import persistReducer from "redux-persist/es/persistReducer";

const persistConfig={
    key:'persist-store',
    storage
}

const persistedReducer=persistReducer(persistConfig,reducers);
export const store=createStore(persistedReducer,{},applyMiddleware(thunk));
export const persistor=persistStore(store);


// export default {store,persistor}