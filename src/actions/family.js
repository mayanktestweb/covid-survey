export const SET_FAMILY = "family:setFamily"
export const SET_HEAD = "family:setHead"

export function setFamily(family) {
    return {
        type: SET_FAMILY,
        payload: family
    }
}

export function setHead(head) {
    return {
        type: SET_HEAD,
        payload: head
    }
}