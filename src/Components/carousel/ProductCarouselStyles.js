import styled from "styled-components";

export const ProductCarouselStyles = styled.div`
  .slick-arrow {
    height: 20px;
    width: 20px;
    border-radius: 100px;
  }
  .slick-prev {
    left: -22px !important;
    z-index: 2;
  }
  .slick-next {
    right: -22px !important;
    z-index: 2;
  }
  .slick-next:before {
    background: transparent;
    color: #000;
  }
  .slick-prev:before {
    background: transparent;
    color: #000;
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
    padding: 0px;
  }
`;
