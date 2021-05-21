import styled from "styled-components";

export const CarouselStyles = styled.div`
  .slick-arrow {
    height: 20px;
    width: 20px;
    border-radius: 100px;
  }
  .slick-prev {
    left: 91% !important;
    z-index: 2;
    top: -7%;
  }
  .slick-next {
    right: 18px !important;
    z-index: 2;
    top: -7%;
  }
  .slick-next:before {
    background: transparent;
    color: #000;
  }
  .slick-prev:before {
    background: transparent;
    color: #000;
    font-size: 22px;
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
    position: absolute;
    top: -32px;
    right: 0;
    display: block;
    width: 100%;
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
  }
`;
