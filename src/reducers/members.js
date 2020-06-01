import { SET_MEMBERS, ADD_MEMBER, SET_HEAD, UPDATE_MEMBER_BY_INDEX } from '../actions/members'

let reducer = (state = [], action) => {
    
    if(action.type == SET_MEMBERS) {
        state = action.payload
    } else if (action.type == ADD_MEMBER) {
        state = [...state, action.payload]
    } else if (action.type == SET_HEAD) {
        let head = action.payload
        let allMembers = [...state]
        let membersWithHead = allMembers.map(member => {
            return {...member, headName: head.name, headMobileNumber: head.mobileNumber}
        })
        state = membersWithHead
    } else if (action.type == UPDATE_MEMBER_BY_INDEX) {
        let {index, member} = action.payload
        let allMembers = [...state]
        allMembers.splice(index, 1, member)
        state = allMembers
    }

    return state;
}

export default reducer