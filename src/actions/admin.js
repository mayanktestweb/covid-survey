export const SET_ADMIN = "admin:setAdmin"

export function setAdmin(admin) {
    return {
        type: SET_ADMIN,
        payload: admin
    }
}