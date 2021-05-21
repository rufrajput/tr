import 'antd/dist/antd.css';
import { Parse } from "parse";
import SideMenu from "./SideMenu";
import Category from './category'
import React, { useState, useEffect } from 'react';

const HeaderNav = () => {
  const [bestcategory, setBestCategory] = useState([]);
  const [hideMenu, sethideMenu] = useState(false);

  useEffect(() => {
    const Category = Parse.Object.extend("Category");
    const category = new Parse.Query(Category);
    category.equalTo("parentCategory", null);
    category.descending("createdAt");
    category.limit(3);
    category.find().then(
      (result) => {
        setBestCategory()
      },
      (error) => {
        console.error("error while loading data for best category: ", error);
      }
    );
  }, []);

  return (
    <>
      <nav>
        <div className="container">
          <div className="row">
            {/* <div onMouseEnter={() => sethideMenu(true)} onMouseLeave={() => sethideMenu(false)}> */}
            <div className="mm-toggle-wrap"    >
              <div className="mm-toggle">
                <i className="fa fa-align-justify"></i>
              </div>
              <span className="mm-label">All Categories</span>
            </div>
            <div className="col-md-3 col-sm-3 mega-container hidden-xs" onMouseEnter={() => sethideMenu(true)} onMouseLeave={() => sethideMenu(false)}>
              <div className="navleft-container">
                <div className="mega-menu-title" >
                  <h3>
                    <span>All Categories</span>
                  </h3>
                </div>
                <div onMouseLeave={() => sethideMenu(false)}>
                  <SideMenu hidden={hideMenu} />
                </div>
              </div>
            </div>
            {/* </div> */}
            <Category />
          </div>
        </div>
      </nav>
    </>
  )
}

export default HeaderNav;
