export const isEmptyObject = (obj) => {
    return Object.entries(obj).length === 0 && obj.constructor === Object
}
export const isNullAndEmpty = (obj) => {
    return obj && (Object.entries(obj).length === 0 && obj.constructor === Object)
}