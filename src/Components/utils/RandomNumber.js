export const getUniqueId = () => {
    const UniqueID = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return UniqueID.toString(16);
}