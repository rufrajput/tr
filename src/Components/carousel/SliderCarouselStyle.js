import styled from "styled-components";

export const SliderCarouselStyles = styled.div`
  .slick-arrow {
    height: 20px;
    width: 20px;
    border-radius: 100px;
  }
  .slick-prev {
    left: 14px !important;
    z-index: 2;
  }
  .slick-next {
    right: 14px !important;
    z-index: 2;
  }
  .slick-next:before {
    background: transparent;
    color: #a9a9a9;
  }
  .slick-prev:before {
    background: transparent;
    color:#a9a9a9;
  }
  .slick-next:after {
    background: transparent;
    color: #000;
  }
  .slick-prev:after {
    background: transparent;
    color: #000;
  }
  .slick-dots {
    right: 78px;
    display: block;
    width: 100%;
    top: 322px;
    padding: 0;
    margin: 0;
    list-style: none;
    text-align: right;
    color: red;
  }
  .slick-dots li {
    margin: 0;
  }
  .slick-dots li button:before {
    font-size: 15px;
  }
  .slick-dots li.slick-active button:before {
    opacity: 0.75;
    color: #fabf01;
  }

  .slick-slide img{
    padding: 0;
    height: 350px;
    width: 100%;
  }
`;
