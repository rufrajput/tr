import React, { useState, useEffect } from "react";
import { Parse } from "parse";
import { SliderCarousel } from '../../Components/carousel/SliderCarousel';
const Slider = () => {

  const [slider, setSlider] = useState([]);

  useEffect(() => {
    const SliderData = Parse.Object.extend("Slider");
    const sliderdata = new Parse.Query(SliderData);
    sliderdata.equalTo("isVisible", true)
    sliderdata.find().then(
      (result) => {
        setSlider(result);

      },
      (error) => {
        console.log("error");
      }
    );
  }, []);


  return (
    <>
      <div >
        <div >
          <div className="container" >
            <ul className="w-100 m-0">
              <SliderCarousel>
                {slider && slider.map((data, index) => (
                  <div className="title title_font" key={index}>
                    <img className="p-0" src={data.get("slider_image")._url} alt={'current product shown in slider'} />
                  </div>
                ))}
              </SliderCarousel>
            </ul>


            {/* <div className="col-md-3 col-sm-3 col-xs-12 banner-left hidden-xs">
                  <img src="images/banner-left.jpg" alt="banner" />
                </div>
                <div className="col-sm-9 col-md-9 col-lg-9 col-xs-12 jtv-slideshow">
                  <div id="jtv-slideshow">
                    <div
                      id="rev_slider_4_wrapper"
                      className="rev_slider_wrapper fullwidthbanner-container"
                    >
                      <div
                        id="rev_slider_4"
                        className="rev_slider fullwidthabanner"
                      >
                        <ul>
                          <li
                            data-transition="fade"
                            data-slotamount="7"
                            data-masterspeed="1000"
                            data-thumb=""
                          >
                            <img
                              src="images/slider/slide-3.jpg"
                              data-bgposition="left top"
                              data-bgfit="cover"
                              data-bgrepeat="no-repeat"
                              alt="banner"
                            />
                            <div className="caption-inner">
                              <div
                                className="tp-caption LargeTitle sft  tp-resizeme"
                                data-x="250"
                                data-y="110"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1300"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 3, whiteSpace: "nowrap" }}
                              >
                                Template for your business
                              </div>
                              <div
                                className="tp-caption ExtraLargeTitle sft  tp-resizeme"
                                data-x="200"
                                data-y="160"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1100"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{
                                  zIndex: 2,
                                  whiteSpace: "nowrap",
                                  color: "#fff",
                                  textShadow: "none",
                                }}
                              >
                                Easy to modify
                              </div>
                              <div
                                className="tp-caption"
                                data-x="310"
                                data-y="230"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1100"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{
                                  zIndex: 2,
                                  whiteSpace: "nowrap",
                                  color: "#f8f8f8",
                                }}
                              >
                                Perfect website solution for your
                              </div>
                              <div
                                className="tp-caption sfb  tp-resizeme "
                                data-x="370"
                                data-y="280"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1500"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 4, whiteSpace: "nowrap" }}
                              >
                                <a href="#" className="buy-btn">
                                  Get Started
                                </a>
                              </div>
                            </div>
                          </li>
                          <li
                            data-transition="fade"
                            data-slotamount="7"
                            data-masterspeed="1000"
                            data-thumb=""
                          >
                            <img
                              src="images/slider/slide-1.jpg"
                              data-bgposition="left top"
                              data-bgfit="cover"
                              data-bgrepeat="no-repeat"
                              alt="banner"
                            />
                            <div className="caption-inner left">
                              <div
                                className="tp-caption LargeTitle sft  tp-resizeme"
                                data-x="50"
                                data-y="110"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1300"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 3, whitSpace: "nowrap" }}
                              >
                                Smooth, Rich & Loud Audio
                              </div>
                              <div
                                className="tp-caption ExtraLargeTitle sft  tp-resizeme"
                                data-x="50"
                                data-y="160"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1100"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 2, whitSpace: "nowrap" }}
                              >
                                headphone
                              </div>
                              <div
                                className="tp-caption"
                                data-x="72"
                                data-y="230"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1100"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 2, whitSpace: "nowrap" }}
                              >
                                World's Most advanced Wireless earbuds.
                              </div>
                              <div
                                className="tp-caption sfb  tp-resizeme "
                                data-x="72"
                                data-y="280"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1500"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 2, whitSpace: "nowrap" }}
                              >
                                <a href="#" className="buy-btn">
                                  EXPLORE NOW
                                </a>
                              </div>
                            </div>
                          </li>
                          <li
                            data-transition="fade"
                            data-slotamount="7"
                            data-masterspeed="1000"
                            data-thumb=""
                          >
                            <img
                              src="images/slider/slide-2.jpg"
                              data-bgposition="left top"
                              data-bgfit="cover"
                              data-bgrepeat="no-repeat"
                              alt="banner"
                            />
                            <div className="caption-inner left">
                              <div
                                className="tp-caption LargeTitle sft  tp-resizeme"
                                data-x="350"
                                data-y="100"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1300"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 2, whitSpace: "nowrap" }}
                              >
                                It’s Time To Look
                              </div>
                              <div
                                className="tp-caption ExtraLargeTitle sft  tp-resizeme"
                                data-x="350"
                                data-y="140"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1100"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 2, whitSpace: "nowrap" }}
                              >
                                The New
                              </div>
                              <div
                                className="tp-caption ExtraLargeTitle sft  tp-resizeme"
                                data-x="350"
                                data-y="185"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1100"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 2, whitSpace: "nowrap" }}
                              >
                                Standard
                              </div>
                              <div
                                className="tp-caption"
                                data-x="375"
                                data-y="245"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1100"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 2, whitSpace: "nowrap" }}
                              >
                                The New Standard. under favorable smartwatches
                              </div>
                              <div
                                className="tp-caption sfb  tp-resizeme "
                                data-x="375"
                                data-y="290"
                                data-endspeed="500"
                                data-speed="500"
                                data-start="1500"
                                data-easing="Linear.easeNone"
                                data-splitin="none"
                                data-splitout="none"
                                data-elementdelay="0.1"
                                data-endelementdelay="0.1"
                                style={{ zIndex: 4, whitSpace: "nowrap" }}
                              >
                                <a href="#" className="buy-btn">
                                  Start Buying
                                </a>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <div className="tp-bannertimer"></div>
                      </div>
                    </div>
                  </div>
                </div> */}
          </div>
        </div>
      </div>
    </>)
}
export default Slider