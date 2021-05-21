
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Menu } from 'antd';


const SubCategory = ({ propsData, cat, sideMenu = false }) => {
  const [compData, setCompData] = useState([]);
  const [id, setId] = useState([]);

  var filteredSubCategories = [];

  useEffect(() => {
    setCompData(cat)
    setId(propsData)
  }, [cat, propsData])

  // setCompData(propsData);

  if (compData !== undefined)
    for (var i = 0; i < compData.length; i++) {
      if (compData[i].get('parentCategory') && compData[i].get('parentCategory').id === id && compData[i].get("name") !== "")
        filteredSubCategories.push(compData[i])
      if (i === 500)
        break

    }
  return (
    <>
      {
        sideMenu ?
          <ul className="submenu">
            {filteredSubCategories && filteredSubCategories.map((data, index) => (
              // if(data.get('parentCategory') != null){}
              <Menu.Item key={index} className="ant-menu-item">
                <Link to={`/Shop_grid/${data.id}`}>
                  {data.get('name')}
                </Link>
              </Menu.Item>
            ))}
            {/*  {compData && compData.map((data, index) =>
              <Menu.Item className="ant-menu-item">
                 {data.get('parentCategory') != null && data.get('parentCategory').id==id&&id && data.get('parentCategory').get('name')!='' ?data.get('name'):null} 

              </Menu.Item>
            )}*/}
          </ul>
          :
          <ul className="submenu">
          </ul>
      }

    </>
  )
}

export default SubCategory;

