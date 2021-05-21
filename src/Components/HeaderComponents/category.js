import { Parse } from "parse";
import React, { useState,useEffect } from "react";
import SubCategory from "./SubCategory";
import {Link} from 'react-router-dom';


const Category = () => {
  const [brandsName, setBrandsName] = useState([]);

  useEffect(() => {
    const Brands = Parse.Object.extend("Brands");
    const brand = new Parse.Query(Brands);
    brand.find().then(
      (result) => {
        setBrandsName(result);
       
      },
      (error) => {
        console.log("error");
      }
    );
  }, []);




  return (
    <>
      <div className="col-md-9 col-sm-9 jtv-megamenu">
        <div className="mtmegamenu">
          <ul className="hidden-xs">
            <li className="mt-root demo_custom_link_cms">
              <div className="mt-root-item">
                <Link to="/">
                  <div className="title title_font">
                    <span className="title-text">Home</span>
                  </div>
                </Link>
              </div>
            </li>
            <li className="mt-root">
              <div className="mt-root-item">
                <Link to="#">
                  <div className="title title_font">
                    <span className="title-text">Brands</span>
                  </div>
                </Link>
              </div>
              <ul className="menu-items col-xs-12">
                {brandsName && brandsName.map((data,index)=>(
                  <li className="menu-item depth-1 menucol-1-3 " key={index}>
                  <div className="title title_font">
                    <Link to={`/brands/${data.id}`}>{data.get('name')}</Link>
                  </div>
                </li>
                ))}
              </ul>
            </li>
            <li>
              
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
export default Category;
