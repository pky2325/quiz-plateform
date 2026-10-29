import { legacy_createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";


const initialState = {
    questions: [],
    result: null,
};


function rootReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_QUESTIONS":
            return {
                ...state,
                questions:
                    action.payload,
            };

        case "SET_RESULT":
            return {
                ...state,
                result: action.payload,
            };


        case "CLEAR_RESULT":
            return {
                ...state,
                result: null,
            };
        default:
            return state;
    }
}

const store = legacy_createStore(
    rootReducer,
    applyMiddleware(thunk)
);

export default store;