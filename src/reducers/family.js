import { SET_FAMILY, SET_HEAD } from '../actions/family'

let reducer = (state = null, action) => {
    
    if(action.type == SET_FAMILY) {
        state = action.payload
    } else if (action.type == SET_HEAD) {
        let head = action.payload
        state = {...state, headName: head.name, headGovtIdType: head.govtIdType, headGovtIdNumber: 
         head.govtIdNumber, headMobileNumber: head.mobileNumber }
    }

    return state;
}

export default reducer