export const SET_MEMBERS = "members:setMembers"
export const ADD_MEMBER = "members:addMember"
export const SET_HEAD = "members:setHead"
export const UPDATE_MEMBER_BY_INDEX = "members:updateMemberByIndex"

export function setMembers(members) {
    return {
        type: SET_MEMBERS,
        payload: members
    }
}

export function addMember(member) {
    return {
        type: ADD_MEMBER,
        payload: member
    }
}

export function setHead(head) {
    return {
        type: SET_HEAD,
        payload: head
    }
}

export function updateMemberByIndex({index, member}) {
    return {
        type: UPDATE_MEMBER_BY_INDEX,
        payload: {index, member}
    }
}