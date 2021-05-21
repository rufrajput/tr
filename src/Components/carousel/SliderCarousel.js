import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { SliderCarouselStyles } from "./SliderCarouselStyle";

export const SliderCarousel = ({ children, totalSlides = 1 }) => {
  const settings = {
    arrows: true,
    dots: false,
    infinite: true,
    centerMode: false,
    speed: 500,
    autoplay: true,
    slidesToShow: totalSlides,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  return (
    <SliderCarouselStyles>
      <Slider {...settings}>{children}</Slider>
    </SliderCarouselStyles>
  );
};
