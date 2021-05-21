import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { CarouselStyles } from "./CarouselStyles";

export const SpecialOfferCarousel = ({ children, totalSlides = 4 }) => {
  const settings = {
    arrows: true,
    dots: false,
    infinite: true,
    centerMode: false,
    speed: 500,
    autoplay: false,
    slidesToShow: totalSlides,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: false,
          infinite: true
          
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          infinite: true
        },
      },
    ],
  };

  return (
    <CarouselStyles>
      <Slider {...settings}>{children}</Slider>
    </CarouselStyles>
  );
};
