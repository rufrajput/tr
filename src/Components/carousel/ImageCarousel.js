import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const ImageCarousel = ({ slideEnable=true, indicatorsEnable=false, controlsHidden=false, images }) => {
    const photos = {
        photo: images.map(image => image)
    }
    // const carouselHeight = '417px';
    // const carouselWidth= '1149px';
    return (
        <>
        { controlsHidden ? <style>
                {
                    `
                    .carousel-control-next-icon, .carousel-control-prev-icon { 
                        visibility: hidden; 
                    }
                    .carousel:hover .carousel-control-next-icon, .carousel:hover .carousel-control-prev-icon {
                         visibility: visible; 
                        }
                    `
                }
            </style> : null }

            <Carousel 
                indicators={indicatorsEnable}
                slide={slideEnable} 
            >
                {photos.photo.map((slideImg) => {
                    return (
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={slideImg.imgSrc}
                                alt={slideImg.imgAlt} />
                        </Carousel.Item>
                    )
                })}

            </Carousel>

        </>
    )
}

export default ImageCarousel;