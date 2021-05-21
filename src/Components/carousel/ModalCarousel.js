import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {ModalCarouselStyles} from './ModalCarousalStyle';

export const ModalCarousel = ({ children, totalSlides = 1}) => {
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
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
    ],
  };

  return (
    <ModalCarouselStyles>
      <Slider {...settings}>{children}</Slider>
    </ModalCarouselStyles>
  );
};