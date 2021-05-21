import React from 'react';
import {Link} from 'react-router-dom';
import { Helmet } from "react-helmet";
import RNUrlPreview from 'react-native-url-preview';


const AboutUs = () =>{
    return(
        <>
<div className="breadcrumbs">

<Helmet>
                    <meta name="og:title" content="Product NTap" data-rh="true" />
                    <meta property="og:image" content={"https://i.ytimg.com/vi/qUdDKuxb7bc/maxresdefault.jpg"} data-rh="true" />
                </Helmet>

    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <ul>
            <li className="home"> <Link title="Go to Home Page" to="/">Home</Link><span>&raquo;</span></li>
            <li><strong>About Us</strong></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div className="main container">
 
 <div className="about-page">
    <div className="col-xs-12 col-sm-6"> 
      
      <h1>Welcome to <span className="text_color">ShopMart</span></h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras lacus metus, convallis ut leo nec, tincidunt eleifend justo. Ut felis orci, hendrerit a pulvinar et, gravida ac lorem. Sed vitae molestie sapien, at sollicitudin tortor.<br/>
        <br/>
        Duis id volutpat libero, id vestibulum purus.Donec euismod accumsan felis, <Link href="/">egestas lobortis velit tempor</Link> vitae. Integer eget velit fermentum, dignissim odio non, bibendum velit.</p>
      <ul>
        <li><i className="fa fa-arrow-right"></i>&nbsp; <Link href="#">Suspendisse potenti. Morbi mollis tellus ac sapien.</Link></li>
        <li><i className="fa fa-arrow-right"></i>&nbsp; <Link href="#">Cras id dui. Nam ipsum risus, rutrum vitae, vestibulum eu.</Link></li>
        <li><i className="fa fa-arrow-right"></i>&nbsp; <Link href="#">Phasellus accumsan cursus velit. Pellentesque egestas.</Link></li>
        <li><i className="fa fa-arrow-right"></i>&nbsp; <Link href="#">Lorem Ipsum generators on the Internet tend to repeat predefined.</Link></li>
      </ul>
    </div>
    <div className="col-xs-12 col-sm-6">
      <div className="single-img-add sidebar-add-slider">
        <div id="carousel-example-generic" className="carousel slide" data-ride="carousel"> 
          
         
          <div className="carousel-inner" role="listbox">
            <div className="item active"> <img src="images/about_us_slide1.jpg" alt="slide1"/> </div>
            <div className="item"> <img src="images/about_us_slide2.jpg" alt="slide2"/> </div>
            <div className="item"> <img src="images/about_us_slide3.jpg" alt="slide3"/> </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>

<section id="service" className="text-center"> 
    
   
    
    <div className="container">
     
      <div className="row">
        <div className="col-sm-3 col-md-3">
          <div className="wow fadeInUp" data-wow-delay="0.2s">
            <div className="service-box">
              <div className="service-icon"> <i className="icon-diamond icons"></i> </div>
              <div className="service-desc">
                <h4>Web Design</h4>
                <p>Lorem ipsum dolor sit amet set, consectetur utes anet adipisicing elit, sed do eiusmod tempor incidist.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 col-md-3">
          <div className="wow fadeInLeft" data-wow-delay="0.2s">
            <div className="service-box">
              <div className="service-icon"> <i className="icon-settings icons"></i> </div>
              <div className="service-desc">
                <h4>Programming</h4>
                <p>Lorem ipsum dolor sit amet set, consectetur utes anet adipisicing elit, sed do eiusmod tempor incidist.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 col-md-3">
          <div className="wow fadeInUp" data-wow-delay="0.2s">
            <div className="service-box">
              <div className="service-icon"> <i className="icon-camera icons"></i> </div>
              <div className="service-desc">
                <h4>Photography</h4>
                <p>Lorem ipsum dolor sit amet set, consectetur utes anet adipisicing elit, sed do eiusmod tempor incidist.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 col-md-3">
          <div className="wow fadeInRight" data-wow-delay="0.2s">
            <div className="service-box">
              <div className="service-icon"> <i className="icon-magnifier-add icons"></i> </div>
              <div className="service-desc">
                <h4>SEO</h4>
                <p>Lorem ipsum dolor sit amet set, consectetur utes anet adipisicing elit, sed do eiusmod tempor incidist.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div className="our-team"> 

    
   
      
    <div className="container"> <div className="page-header">
        <h2>Our Team</h2>
      </div>
      <div className="row">
        <div className="col-xs-6 col-sm-3 col-md-3">
          <div className="wow bounceInUp" data-wow-delay="0.2s">
            <div className="team">
              <div className="inner">
                <div className="avatar"><img src="images/team-img01.jpg" alt="HTML template" className="img-responsive" /></div>
                <h5>Joana Doe</h5>
                <p className="subtitle">Art-director</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-6 col-sm-3 col-md-3">
          <div className="wow bounceInUp" data-wow-delay="0.5s">
            <div className="team">
              <div className="inner">
                <div className="avatar"><img src="images/team-img02.jpg" alt="HTML template" className="img-responsive" /></div>
                <h5>Josefine</h5>
                <p className="subtitle">Team Leader</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-6 col-sm-3 col-md-3">
          <div className="wow bounceInUp" data-wow-delay="0.8s">
            <div className="team">
              <div className="inner">
                <div className="avatar"><img src="images/team-img03.jpg" alt="HTML template" className="img-responsive" /></div>
                <h5>Paulo Moreira</h5>
                <p className="subtitle">Senior Web Developer</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-6 col-sm-3 col-md-3">
          <div className="wow bounceInUp" data-wow-delay="1s">
            <div className="team">
              <div className="inner">
                <div className="avatar"><img src="images/team-img04.jpg" alt="HTML template" className="img-responsive" /></div>
                <h5>Tom Joana</h5>
                <p className="subtitle">Digital Creative Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

        </>
    )
}

export default AboutUs;