export default (state, action) => {
    switch (action.type) {
        case 'Set_UserName':
            return {
                custmerName: action.payload,

            }
        case 'Set_Guest':
            return {
                custmerGuest: action.payload
            }
        default:
            return state
    }
}