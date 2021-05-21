import React from 'react';
import {Link} from 'react-router-dom'


const HeaderMobile = () =>{


return(
    <>

<div id="mobile-menu">
  <ul>
    <li><Link to="index.html" className="home1">Home Pages</Link>
      <ul>
        <li><Link to="index.html"><span>Home Version 1</span></Link></li>
        <li><Link to="version2/index.html"><span>Home Version 2</span></Link></li>
        <li><Link to="version3/index.html"><span>Home Version 3</span></Link></li>
        <li><Link to="version4/index.html"><span>Home Version 4</span></Link></li>
        <li><Link to="../version1rtl/index.html"><span>Home Version 1 RTL</span></Link></li>
      </ul>
    </li>
    <li><Link to="#">Pages</Link>
      <ul>
        <li><Link to="#">Shop Pages </Link>
          <ul>
            <li><Link to="shop_grid.html"><span>Grid View Category Page</span></Link></li>
            <li><Link to="shop_grid_full_width.html"><span>Grid View Full Width</span></Link></li>
            <li><Link to="shop_list.html"><span>List View Category Page</span></Link></li>
            <li><Link to="single_product.html"><span>Full Width Product Page</span> </Link></li>
            <li><Link to="single_product_sidebar.html"><span>Product Page With Sidebar</span> </Link></li>
            <li><Link to="single_product_magnify_zoom.html"><span>Product Page Magnify Zoom</span> </Link></li>
            <li><Link to="shopping_cart.html"><span>Shopping Cart</span></Link></li>
            <li><Link to="wishlist.html"><span>Wishlist</span></Link></li>
            <li><Link to="compare.html"><span>Compare Products</span></Link></li>
            <li><Link to="checkout.html"><span>Checkout</span></Link></li>
            <li><Link to="sitemap.html"><span>Sitemap</span></Link></li>
          </ul>
        </li>
        <li><Link to="#">Static Pages </Link>
          <ul>
            <li><Link to="about_us.html"><span>About Us</span></Link></li>
            <li><Link to="contact_us.html"><span>Contact Us</span></Link></li>
            <li><Link to="orders_list.html"><span>Orders List</span></Link></li>
            <li><Link to="order_details.html"><span>Order Details</span></Link></li>
            <li><Link to="404error.html"><span>404 Error</span> </Link></li>
            <li><Link to="faq.html"><span>FAQ Page</span></Link></li>
            <li><Link to="manufacturers.html"><span>Manufacturers</span></Link></li>
            <li><Link to="quick_view.html"><span>Quick View</span></Link></li>
            <li><Link to="dashboard.html"><span>Account Dashboard</span></Link></li>
            <li><Link to="shortcodes.html"><span>Shortcodes</span> </Link></li>
            <li><Link to="typography.html"><span>Typography</span></Link></li>
          </ul>
        </li>
        <li><Link to="#"> Blog Pages </Link>
          <ul>
            <li><Link to="blog_right_sidebar.html">Blog – Right sidebar </Link></li>
            <li><Link to="blog_left_sidebar.html">Blog – Left sidebar </Link></li>
            <li><Link to="blog_full_width.html">Blog - Full width</Link></li>
            <li><Link to="blog_single_post.html">Single post </Link></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><Link to="blog.html">Blog</Link>
      <ul>
        <li><Link to="blog_right_sidebar.html"> Blog – Right Sidebar </Link></li>
        <li><Link to="blog_left_sidebar.html"> Blog – Left Sidebar </Link></li>
        <li><Link to="blog_full_width.html"> Blog – Full-Width </Link></li>
        <li><Link to="blog_single_post.html"> Single post </Link></li>
      </ul>
    </li>
    <li><Link to="shop_grid.html">TV &amp; Audio</Link>
      <ul>
        <li><Link to="#" className="">Headphones</Link>
          <ul>
            <li><Link to="shop_grid.html">Receivers &amp; Amplifier</Link></li>
            <li><Link to="shop_grid.html">Speakers Sports</Link></li>
            <li><Link to="shop_grid.html">Audio CD Players</Link></li>
            <li><Link to="shop_grid.html">Turntables</Link></li>
          </ul>
        </li>
        <li><Link to="#">Gaming Headsets</Link>
          <ul>
            <li><Link to="shop_grid.html">Accessories</Link></li>
            <li><Link to="shop_grid.html">Smart TVs Speakers</Link></li>
            <li><Link to="shop_grid.html">Cases &amp; Towers</Link></li>
            <li><Link to="shop_grid.html">Gaming Budget</Link></li>
          </ul>
        </li>
        <li><Link to="#">Home Theater Systems</Link>
          <ul>
            <li><Link to="shop_grid.html">TV &amp; Cinema</Link></li>
            <li><Link to="shop_grid.html">4K Ultra HD TVs</Link></li>
            <li><Link to="shop_grid.html">Curved TVs</Link></li>
            <li><Link to="shop_grid.html">Sound Bars</Link></li>
          </ul>
        </li>
        <li><Link to="#">Appliances</Link>
          <ul>
            <li><Link to="shop_grid.html">Refrigerators</Link></li>
            <li><Link to="shop_grid.html">Vacuum Cleaners</Link></li>
            <li><Link to="shop_grid.html">Irons &amp; Steamers</Link></li>
            <li><Link to="shop_grid.html">Washers Dryers</Link></li>
          </ul>
        </li>
        <li><Link to="#">Photo &amp; Camera</Link>
          <ul>
            <li><Link to="shop_grid.html">Cameras Digital SLR</Link></li>
            <li><Link to="shop_grid.html">Instant Film</Link></li>
            <li><Link to="shop_grid.html">Point &amp; Shoot</Link></li>
            <li><Link to="shop_grid.html">Waterproof</Link></li>
          </ul>
        </li>
        <li><Link to="#">Accessories</Link>
          <ul>
            <li><Link to="shop_grid.html">Cables Chargers</Link></li>
            <li><Link to="shop_grid.html">Cases Backup Battery</Link></li>
            <li><Link to="shop_grid.html">Meebox</Link></li>
            <li><Link to="shop_grid.html">Packs Screen</Link></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><Link to="shop_grid.html">Apple Store</Link>
      <ul>
        <li><Link to="#" className="">Notebooks</Link>
          <ul className="level1">
            <li><Link to="shop_grid.html">Gradiente</Link></li>
            <li><Link to="shop_grid.html">Samsung</Link></li>
            <li><Link to="shop_grid.html">Toshiba</Link></li>
            <li><Link to="shop_grid.html">Nintendo DS</Link></li>
          </ul>
        </li>
        <li><Link to="#">Televisions</Link>
          <ul className="level1">
            <li><Link to="shop_grid.html">LCD Televisions</Link></li>
            <li><Link to="shop_grid.html">Projection Televisions</Link></li>
            <li><Link to="shop_grid.html">Play Stations</Link></li>
            <li><Link to="shop_grid.html">Video Accessories</Link></li>
          </ul>
        </li>
        <li><Link to="#" className="">Computer</Link>
          <ul className="level1">
            <li><Link to="shop_grid.html">Laptop</Link></li>
            <li><Link to="shop_grid.html">Mobile Electronics</Link></li>
            <li><Link to="shop_grid.html">Movies &amp; Music</Link></li>
            <li><Link to="shop_grid.html">Audio &amp; Video</Link></li>
          </ul>
        </li>
        <li><Link to="#">Home Theater</Link>
          <ul className="level1">
            <li><Link to="shop_grid.html">LED &amp; LCD TVs</Link></li>
            <li><Link to="shop_grid.html">Smart TVs</Link></li>
            <li><Link to="shop_grid.html">Speakers Sound Bars</Link></li>
            <li><Link to="shop_grid.html">Audio CD Players</Link></li>
          </ul>
        </li>
        <li><Link to="#">Accesories</Link>
          <ul className="level1">
            <li><Link to="shop_grid.html">Theater Systems</Link></li>
            <li><Link to="shop_grid.html">Turntables</Link></li>
            <li><Link to="shop_grid.html">Laptops Bags</Link></li>
            <li><Link to="shop_grid.html">Gaming Headsets</Link></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><Link to="shop_grid.html">Photo &amp; Camera</Link>
      <ul>
        <li><Link to="shop_grid.html">Mobiles</Link>
          <ul>
            <li><Link to="shop_grid.html">iPhone</Link></li>
            <li><Link to="shop_grid.html">Samsung</Link></li>
            <li><Link to="shop_grid.html">Nokia</Link></li>
            <li><Link to="shop_grid.html">Sony</Link></li>
          </ul>
        </li>
        <li><Link to="shop_grid.html" className="">Music &amp; Audio</Link>
          <ul>
            <li><Link to="shop_grid.html">Audio</Link></li>
            <li><Link to="shop_grid.html">Cameras</Link></li>
            <li><Link to="shop_grid.html">Appling</Link></li>
            <li><Link to="shop_grid.html">Car Music</Link></li>
          </ul>
        </li>
        <li><Link to="shop_grid.html">Accessories</Link>
          <ul>
            <li><Link to="shop_grid.html">Home &amp; Office</Link></li>
            <li><Link to="shop_grid.html">TV &amp; Home Theater</Link></li>
            <li><Link to="shop_grid.html">Phones &amp; Radio</Link></li>
            <li><Link to="shop_grid.html">All Electronics</Link></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><Link to="shop_grid.html">Smartphone</Link></li>
    <li><Link to="shop_grid.html">Games &amp; Video</Link></li>
    <li><Link to="shop_grid.html">Laptop</Link></li>
    <li><Link to="shop_grid.html">Accessories</Link></li>
  </ul>
</div>

    </>
)
}

export default HeaderMobile;