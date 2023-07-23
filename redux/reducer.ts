import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import authSlice from './authSlice';
import listSlice from './listSlice';

const combinedReducer = combineReducers({
    auth: authSlice,
    list: listSlice
});

const rootReducer: typeof combinedReducer = (state, action) => {
    if(action.type === HYDRATE) {
        const nextState = {
            ...state,
            ...action.payload
        }
        return nextState
    } else {
        return combinedReducer(state, action)
    }
}

export default rootReducer;