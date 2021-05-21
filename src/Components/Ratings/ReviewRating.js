import React, { useState, useEffect } from 'react';
import { Parse } from 'parse';
import { useParams } from 'react-router-dom';


const ReviewRating = () => {
    const { name } = useParams();
    const [Rating, setRatings] = useState();
    useEffect(() => {
        var ratingResultId;
        const Details = Parse.Object.extend('Products')
        const query = new Parse.Query(Details);
        query.equalTo("isVisible", true);
        query.equalTo('slug', name)
        query.find().then(
            (result) => {
                ratingResultId = result[0].id;
                const Ratings = Parse.Object.extend('Ratings')
                const ratings = new Parse.Query(Ratings);
                ratings.limit(3);
                // ratings.equalTo("isApproved", true)
                ratings.equalTo('product', { "__type": "Pointer", "className": "Products", "objectId": ratingResultId && ratingResultId });
                ratings.find().then(

                    (result) => {
                        setRatings(result)
                    });
            })
    }, [name]);

    const renderPriceRating = (ratingObj) => {
        const rating = ratingObj.get("priceRating");
        if (rating) {
            switch (rating) {

                case 1:
                    return (
                        <div className="rating">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                        </div>
                    )
                case 2:
                    return (
                        <div className="rating">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                        </div>
                    )
                case 3:
                    return (
                        <div className="rating">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                        </div>
                    )
                case 4:
                    return (
                        <div className="rating">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star-o"></i>
                        </div>
                    )
                case 5:
                    return (
                        <div className="rating">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                        </div>
                    )
                default:
                    return (
                        <div className="rating">
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                            <i className="fa fa-star-o"></i>
                        </div>
                    )
            }
        }

    }


    const renderValueRating = (ratingObj) => {
        const rating = ratingObj.get("valueRating");
        switch (rating) {

            case 1:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 2:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 3:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 4:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 5:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                    </div>
                )
            default:
                return (
                    <div className="rating">
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
        }

    }
    const renderQualityRating = (ratingObj) => {
        const rating = ratingObj.get("qualityRating");
        switch (rating) {

            case 1:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 2:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 3:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 4:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 5:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                    </div>
                )
            default:
                return (
                    <div className="rating">
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
        }

    }


    return (
        <>
            {Rating && Rating.length !== 0 ?
                <div className="review-ratting">
                    {Rating.map((data) => (
                        <table>
                            <p>{data.get('comment')}</p>
                            <tbody>
                                <tr>
                                    <th>Price</th>
                                    <td>
                                        {renderPriceRating(data)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Value</th>
                                    <td>
                                        {renderValueRating(data)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Quality</th>
                                    <td>
                                        {renderQualityRating(data)}
                                    </td>
                                </tr>
                            </tbody>
                            <p>Reviewed by:</p>
                            <p className="author">
                                {data.get('name')} ({data.get('createdAt').getDate()}/{data.get('createdAt').getMonth() + 1}/{data.get('createdAt').getFullYear()})
                                <small> </small>
                            </p>
                        </table>
                    ))}
                </div>
                : <h5>Result Not Found</h5>}
        </>
    )
}
export default ReviewRating;