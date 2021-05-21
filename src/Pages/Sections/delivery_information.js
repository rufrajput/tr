import React from "react";
import Slider from "./Sections/slider";
import SpeciailOffer from "./Sections/specialoffer";
import BestSelling from "./Sections/bestselling";
import DealsOfDay from "./Sections/dealsofday";
import TopRate from "./Sections/toprate";
import NewProducts from "./Sections/newproducts";
import LatestNews from './Sections/latestNews';
import ClientSlider from "./Sections/clientslider";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="cms-index-index cms-home-page">
        <div id="page">
          <div className="text-center">
            <h3>Delivery Information</h3>
          </div>
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
