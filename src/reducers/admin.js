import { SET_ADMIN } from '../actions/admin'

let reducer = (state = null, action) => {
    
    if(action.type == SET_ADMIN) {
        state = action.payload
    }

    return state;
}

export default reducer