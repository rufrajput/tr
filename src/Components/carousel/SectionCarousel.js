import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { SectionCarouselStyles } from "./SectionCarouselStyles";

export const SectionCarousel = ({ children, totalSlides = 4 }) => {
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
          infinite: true,
          dots: false
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        },
      },
    ],
  };

  return (
    <SectionCarouselStyles>
      <Slider {...settings}>{children}</Slider>
    </SectionCarouselStyles>
  );
};
