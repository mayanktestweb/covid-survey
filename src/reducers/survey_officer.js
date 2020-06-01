import { SET_SURVEY_OFFICER } from '../actions/survey_officer'

let reducer = (state = null, action) => {
    
    if(action.type == SET_SURVEY_OFFICER) {
        state = action.payload
    }

    return state;
}

export default reducer