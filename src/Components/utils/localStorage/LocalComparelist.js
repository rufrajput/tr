export const setComparelistToStorage = (comparelistItems) => {
    localStorage.setItem('comparelist', JSON.stringify(comparelistItems));
}

export const getComparelistFromStorage = () => {
    return JSON.parse(localStorage.getItem('comparelist'));
}