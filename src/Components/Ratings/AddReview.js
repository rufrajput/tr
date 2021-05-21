import React, { useState, useEffect } from 'react';
import { Parse } from 'parse';
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import { notification } from 'antd';


const AddReview = () => {
    const { name } = useParams();
    const [names, setName] = useState();
    const [comment, setComment] = useState();
    const [priceRating, setPriceRating] = useState();
    const [valueRating, setValueRating] = useState();
    const [qualityRating, setQualityRating] = useState();
    const { register, handleSubmit } = useForm();
    const [ratingReviews, setRatingReviews] = useState();

    useEffect(() => {
        const Details = Parse.Object.extend('Products')
        const query = new Parse.Query(Details);
        query.equalTo("isVisible", true);
        query.equalTo('slug', name)
        query.include("ProductsRating")
        query.find().then(
            (result) => {
                setRatingReviews(result[0].id)
            }
        )
    }, [name]);

    const onSubmit = data => {
        if (data) {
            const Ratings = Parse.Object.extend('Ratings');
            const ratings = new Ratings();
            ratings.set('name', names);
            ratings.set('comment', comment);
            ratings.set('qualityRating', qualityRating);
            ratings.set('priceRating', priceRating);
            ratings.set('valueRating', valueRating);
            ratings.set('product', { "__type": "Pointer", "className": "Products", "objectId": ratingReviews && ratingReviews });
            ratings.save().then(
                (result) => {
                    openToste()
                });
        }
    };

    const handleQualityRating = (e) => {
        setQualityRating(parseInt(e.target.value))
    }
    const handlePriceRating = (e) => {
        setPriceRating(parseInt(e.target.value))
    }
    const handleValueRating = (e) => {
        setValueRating(parseInt(e.target.value))
    }
    const handleName = (e) => {
        setName(e.target.value)
    }
    const handleComment = (e) => {
        setComment(e.target.value)
    }
    const openToste = (data) => {

        notification.success({
            message: 'Thank you for submitting a review!   ',
        });
    };


    // const handleSummary = (e) => {
    //     setReviewSummary(e.target.value)
    // }
    return (

        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h4>How do you rate this product?<em>*</em></h4>
                <div className="table-responsive reviews-table reviews_table">
                    <table>
                        <tbody>
                            <tr>
                                <th></th>
                                <th>1 star</th>
                                <th>2 stars</th>
                                <th>3 stars</th>
                                <th>4 stars</th>
                                <th>5 stars</th>
                            </tr>
                            <tr>
                                <td>Quality</td>
                                <td><label for="qualtyRatingRadio1"><input name="qualtyRatingRadio" id="qualtyRatingRadio1" onChange={handleQualityRating} type="radio" value={1} /></label></td>
                                <td><label for="qualtyRatingRadio2"><input name="qualtyRatingRadio" id="qualtyRatingRadio2" onChange={handleQualityRating} type="radio" value={2} /></label></td>
                                <td><label for="qualtyRatingRadio3"><input name="qualtyRatingRadio" id="qualtyRatingRadio3" onChange={handleQualityRating} type="radio" value={3} /></label></td>
                                <td><label for="qualtyRatingRadio4"><input name="qualtyRatingRadio" id="qualtyRatingRadio4" onChange={handleQualityRating} type="radio" value={4} /></label></td>
                                <td><label for="qualtyRatingRadio5"><input name="qualtyRatingRadio" id="qualtyRatingRadio5" onChange={handleQualityRating} type="radio" value={5} /></label></td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td><label for="priceRatingRadio1"><input name="priceRatingRadio" id="priceRatingRadio1" onChange={handlePriceRating} type="radio" value={1} /></label></td>
                                <td><label for="priceRatingRadio2"><input name="priceRatingRadio" id="priceRatingRadio2" onChange={handlePriceRating} type="radio" value={2} /></label></td>
                                <td><label for="priceRatingRadio3"><input name="priceRatingRadio" id="priceRatingRadio3" onChange={handlePriceRating} type="radio" value={3} /></label></td>
                                <td><label for="priceRatingRadio4"><input name="priceRatingRadio" id="priceRatingRadio4" onChange={handlePriceRating} type="radio" value={4} /></label></td>
                                <td><label for="priceRatingRadio5"><input name="priceRatingRadio" id="priceRatingRadio5" onChange={handlePriceRating} type="radio" value={5} /></label></td>
                            </tr>
                            <tr>
                                <td>Value</td>
                                <td><label for="valueRatingRadio1"><input name="valueRatingRadio" id="valueRatingRadio1" onChange={handleValueRating} type="radio" value={1} /></label></td>
                                <td><label for="valueRatingRadio2"><input name="valueRatingRadio" id="valueRatingRadio2" onChange={handleValueRating} type="radio" value={2} /></label></td>
                                <td><label for="valueRatingRadio3"><input name="valueRatingRadio" id="valueRatingRadio3" onChange={handleValueRating} type="radio" value={3} /></label></td>
                                <td><label for="valueRatingRadio4"><input name="valueRatingRadio" id="valueRatingRadio4" onChange={handleValueRating} type="radio" value={4} /></label></td>
                                <td><label for="valueRatingRadio5"><input name="valueRatingRadio" id="valueRatingRadio5" onChange={handleValueRating} type="radio" value={5} /></label></td>

                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="form-area">
                    <div className="form-element">
                        <label>Nickname <em>*</em></label>
                        <input type="text" name="name"
                            onChange={handleName}
                            id="name"
                            ref={register({
                                required: {
                                    value: true,
                                    message: "You must enter your name"
                                },
                            })} />
                    </div>
                    <div className="form-element">
                        <label>Summary of Your Review <em>*</em></label>
                        <input type="text" name="review"
                            id="review"
                            ref={register({
                                required: {
                                    value: true,
                                    message: "You must enter review summary"
                                },
                            })} />
                    </div>
                    <div className="form-element">
                        <label>Review <em>*</em></label>
                        <textarea name="review"
                            onChange={handleComment}
                            id="review" ref={register({
                                required: {
                                    value: true,
                                    message: "You must enter cooment about review "
                                },
                            })}></textarea>
                    </div>
                    <div className="buttons-set">
                        <button className="button submit" title="Submit Review" type="submit">
                            <span><i className="fa fa-thumbs-up"></i>
                                      &nbsp;Review</span>
                        </button>
                    </div>
                </div>
            </form>

        </>
    )
}

export default AddReview;