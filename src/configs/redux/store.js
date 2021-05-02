import { applyMiddleware, createStore } from "redux";
import rootReducer from "./reducer/index";
import thunk from "redux-thunk";
const createStored = createStore;

export default createStored(rootReducer, applyMiddleware(thunk));
