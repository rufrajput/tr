import React from "react";
import Slider from "./Sections/slider";
import SpeciailOffer from "./Sections/specialoffer";
import BestSelling from "./Sections/bestselling";
import DealsOfDay from "./Sections/dealsofday";
import TopRate from "./Sections/toprate";
import NewProducts from "./Sections/newproducts";
import LatestNews from './Sections/latestNews';
import ClientSlider from "./Sections/clientslider";
import {Link} from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="cms-index-index cms-home-page">
        <div id="page">
          {/* <!-- Slideshow  --> */}
          <Slider />
          {/* <!-- service section --> */}
          <div className="jtv-service-area">
            <div className="container">
              <div className="row">
                <div className="col col-md-3 col-sm-6 col-xs-12">
                  <div className="block-wrapper ship">
                    <div className="text-des">
                      <div className="icon-wrapper">
                        <i className="fa fa-paper-plane"></i>
                      </div>
                      <div className="service-wrapper">
                        <h3>World-Wide Shipping</h3>
                        <p>On order over $99</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-md-3 col-sm-6 col-xs-12 ">
                  <div className="block-wrapper return">
                    <div className="text-des">
                      <div className="icon-wrapper">
                        <i className="fa fa-rotate-right"></i>
                      </div>
                      <div className="service-wrapper">
                        <h3>100% secure payments</h3>
                        <p>Credit/ Debit Card/ Banking </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-md-3 col-sm-6 col-xs-12">
                  <div className="block-wrapper support">
                    <div className="text-des">
                      <div className="icon-wrapper">
                        <i className="fa fa-umbrella"></i>
                      </div>
                      <div className="service-wrapper">
                        <h3>Support 24/7</h3>
                        <p>Call us: ( +123 ) 456 789</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-md-3 col-sm-6 col-xs-12">
                  <div className="block-wrapper user">
                    <div className="text-des">
                      <div className="icon-wrapper">
                        <i className="fa fa-tags"></i>
                      </div>
                      <div className="service-wrapper">
                        <h3>Member Discount</h3>
                        <p>25% on order over $199</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SpeciailOffer />
          {/* <!-- All products--> */}

          <div className="container">
            <div className="home-tab">
              <BestSelling />
              
            </div>
          </div>

          {/* {Deals of Day} */}
           <DealsOfDay />

          <div className="banner-section">
            {/* <div className="container">
              <div className="row">
                <div className="col-sm-6">
                  <figure>
                    <a href="#" target="_self" className="image-wrapper">
                      <img src="images/banner-laptop.jpg" alt="banner laptop" />
                    </a>
                  </figure>
                </div>
                <div className="col-sm-6">
                  <figure>
                    <a href="#" target="_self" className="image-wrapper">
                      <img src="images/banner-mob.jpg" alt="banner moblie" />
                    </a>
                  </figure>
                </div>
              </div>
            </div> */}
          </div>
          <div className="featured-products">
            <div className="container">
              <div className="row">
                {/* <!-- Best Sale --> */}
               <TopRate />
                {/* <!-- Banner --> */}
                {/* <div className="col-md-4 top-banner hidden-sm">
                  <div className="jtv-banner3">
                    <div className="jtv-banner3-inner">
                      <a href="#">
                        <img src="images/sub1a.jpg" alt="HTML template" />
                      </a>
                      <div className="hover_content">
                        <div className="hover_data bottom">
                          <div className="desc-text">
                            Top Brands at discount prices
                          </div>
                          <div className="title">Electronisc Sale</div>
                          <span>Smartphone & Cell phone</span>
                          <p>
                            <a href="#" className="shop-now">
                              Get it now!
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              {/* New Products */}
                <NewProducts />
              </div>
            </div>
          </div>

          {/* <!-- Blog --> */}
          <LatestNews />

          {/* <!-- our clients Slider --> */}

          <ClientSlider />

          {/* <!-- BANNER-AREA-START --> */}
          {/* <section className="banner-area">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                  <div className="row">
                    <div className="col-xs-12 col-sm-6 col-lg-6 col-md-6">
                      <div className="banner-block">
                        <a href="#">
                          <img
                            src="images/banner-sunglasses.jpg"
                            alt="banner sunglasses"
                          />
                        </a>
                        <div className="text-des-container">
                          <div className="text-des">
                            <h2>Galaxy Note 5</h2>
                            <p>Fall Phone 25% off Colorful designs!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-lg-6 col-md-6">
                      <div className="banner-block">
                        <a href="#">
                          <img src="images/banner-kids.jpg" alt="banner kids" />
                        </a>
                        <div className="text-des-container">
                          <div className="text-des">
                            <h2>Music & Sound</h2>
                            <p>For the littlest people</p>
                          </div>
                        </div>
                      </div>
                      <div className="banner-block">
                        <a href="#">
                          <img
                            src="images/banner-women.jpg"
                            alt="banner women"
                          />
                        </a>
                        <div className="text-des-container">
                          <div className="text-des">
                            <h2>Best Quality Music</h2>
                            <p>Modern Headphones designs shop!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-4 col-lg-4 col-md-4">
                  <div className="banner-block">
                    <a href="#">
                      <img
                        src="images/banner-arrival.jpg"
                        alt="banner arrival"
                      />
                    </a>
                    <div className="text-des-container">
                      <div className="text-des">
                        <h2>special collection</h2>
                        <p>Sale upto 50% off on selected items</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}
          {/* <!-- Footer --> */}
          <Link to="#" id="back-to-top" title="Back to top">
            <i className="fa fa-angle-up"></i>
          </Link>

          {/* <!-- End Footer -->  */}
        </div>
      </div>
    </>
  );
};
export default Home;
