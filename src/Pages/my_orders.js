import React from "react";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="cms-index-index cms-home-page">
        <div id="page">
          <div className="text-center">
            <h3>My Orders</h3>
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
