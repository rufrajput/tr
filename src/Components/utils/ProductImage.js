import { Parse } from 'parse';

export const getProductImageByName = (data) => {
  let imgSrc = '';
  if (data.get('imageUrl')) {
    imgSrc = "https://cdn.technowise360.com/assets/catalog_600X600/" + data.get("imageUrl")
  }
  else {
    if (data.get("image").get("featuredImage")) {
      imgSrc = data.get("image").get("featuredImage")._url
    }
    else {
      imgSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
    }
  }
  return imgSrc;
}

export const getProductImageForAddOns = (data) => {
  let imgSrc = '';
  if (data.get('addOnId').get('imageUrl')) {
    imgSrc = "https://cdn.technowise360.com/assets/catalog_600X600/" + data.get("imageUrl")
  }
  else {
    if (data.get('addOnId').get("image").get("featuredImage")) {
      imgSrc = data.get('addOnId').get("image").get("featuredImage")._url
    }
    else {
      imgSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
    }
  }
  return imgSrc;
}

export const getProductImageByID = (id) => {
  // incomplete
  const Details = Parse.Object.extend('Products')
  const query = new Parse.Query(Details);
  query.equalTo("isVisible", true);
  query.include('image');
  query.get(id).then((res) => {
    let imgUrlSrc = '';
    if (res.get('imageUrl')) {
      imgUrlSrc = "https://cdn.technowise360.com/assets/catalog_600X600/" + res.get("imageUrl")
    }
    else {
      if (res.get("image").get("featuredImage")) {
        imgUrlSrc = res.get("image").get("featuredImage")._url
      }
      else {
        imgUrlSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
      }
    }
    return imgUrlSrc;
  })
}
