export const handleImgError = (data) => {
    console.log("handleImgError")
    if(data.get("image")){
        return data.get("image").get("featuredImage")._url
    }
}