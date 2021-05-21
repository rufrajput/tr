import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ProductCarouselStyles  } from "./ProductCarouselStyles";

export const ProductCarousel = ({ children, totalSlides = 2}) => {
  const settings = {
    arrows: false,
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
    <ProductCarouselStyles>
      <Slider {...settings}>{children}</Slider>
    </ProductCarouselStyles>
  );
};