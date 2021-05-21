import styled from "styled-components";

export const ModalCarouselStyles = styled.div`
  .slick-arrow {
    height: 20px;
    width: 20px;
    border-radius: 100px;
  }
  .slick-prev {
    left: 22px !important;
    z-index: 2;
  }
  .slick-next {
    right: 22px !important;
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
  .slick-slide img {
    height: auto;
    width: 100%;
    margin: 0 auto;
  }
`;
