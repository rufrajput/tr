import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';
import { Parse } from "parse";
import SubCategory from './SubCategory';

const { SubMenu } = Menu;
// function handleClick(e) 
//   console.log('click', e);
// }

const SideMenu = ({ hidden }) => {
  const [bestcategory, setBestCategory] = useState([]);

  useEffect(() => {
    const Category = Parse.Object.extend("Category");
    const category = new Parse.Query(Category);
    //category.equalTo("parentCategory", null);
    category.descending("name");
    // category.include('parentCategory')
    category.limit(200);
    category.find().then(
      (result) => {
        setBestCategory(result);
      },
      (error) => {
        console.error("error while fetching data for SideMenu", error);
      }
    );
  }, []);
  return (
    <div>
      {
        hidden ?
          <Menu style={{ width: 256 }} mode="vertical">
            {bestcategory && bestcategory.map((data, index) => {
              if (data.get('parentCategory') == null) {
                return (
                  <SubMenu key={index} title={data.get('name')}>
                    <Menu.ItemGroup key={index} className="submenupadding">
                      <SubCategory sideMenu={true} propsData={data.id} cat={bestcategory && bestcategory} />
                    </Menu.ItemGroup>
                  </SubMenu>
                )
              }
              else {
                return '';
              }
            })}
          </Menu>
          :
          null
      }

    </div>
  )
}

export default SideMenu;