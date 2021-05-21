import React, { lazy, Suspense } from "react";
//import Product_detail from './Pages/product_detail';
import { Switch, Route, Router } from "react-router-dom";
import RoutinHistory from './RoutingHistory';
import { OrderProvider } from './contextapi/order_context';
// import "bootstrap/dist/css/bootstrap.min.css";
import ReactSpinner from 'react-bootstrap-spinner';
import Header from "./Pages/header";
import Loader from 'react-loader-spinner'
import Footer from "./Pages/footer";
import Redirect from "./Pages/Sections/404Page";

const Home = lazy(() => import("./Pages/home"));
const ProductDetail = lazy(() => import("./Pages/product_detail"));
const Shop_grid = lazy(() => import("./Pages/Shop_grid"));
const Brands = lazy(() => import("./Pages/Brands"));
const ViewCart = lazy(() => import("./Pages/Sections/ViewCart"));
const CheckOut = lazy(() => import("./Components/Order/CheckOut"));
const Billing = lazy(() => import("./Components/Order/BillingInfo"));
const Shipping = lazy(() => import("./Components/Order/Shipping"));
const SearchPage = lazy(() => import("./Pages/Sections/MainSearchPage"));
const ShippingMethod = lazy(() => import("./Components/Order/ShippingMethod"));
const PaymentInfo = lazy(() => import("./Components/Order/PaymentInfo"));
const OrderReview = lazy(() => import("./Components/Order/OrderReview"));
const WishList = lazy(() => import("./Pages/Sections/WishList"));
const DeliveryInformation = lazy(() => import("./Pages/delivery_information"));
const Discount = lazy(() => import("./Pages/discount"));
const PrivacyPolicy = lazy(() => import("./Pages/privacy_policy"));
const FAQs = lazy(() => import("./Pages/faqs"));
const TermsAndCondition = lazy(() => import("./Pages/terms_and_condition"));
const News = lazy(() => import("./Pages/news"));
const Trends = lazy(() => import("./Pages/trends"));
const ContactUs = lazy(() => import("./Pages/contact_us"));
const MyOrders = lazy(() => import("./Pages/my_orders"));
const ThankYou = lazy(() => import("./Pages/Sections/thankyou"));
const ReturnPolicy = lazy(() => import("./Pages/return_policy"));
const Compare = lazy(() => import("./Pages/Sections/Compare"));
const AccountPage = lazy(() => import("./Pages/Sections/Accountpage"));
const AboutUs = lazy(() => import("./Pages/Sections/AboutUs"));
const Error = lazy(() => import("./Pages/Sections/404Page"));
const UserInformation = lazy(() => import("./Pages/Sections/UserInformation"));
const Dashboard = lazy(() => import("./Pages/Sections/Dashboard"));
const CreditCard = lazy(() => import("./Components/PaymentsMethod/CreditCard"));
const ConfirmEmail = lazy(() => import("./Components/PasswordForget/ConfirmEmail"));
const PasswordRest = lazy(() => import("./Components/PasswordForget/Resetpassword"));
const OrderList = lazy(() => import("./Pages/Sections/OrderList"));
const BillingAddress = lazy(() => import("./Pages/Sections/BillingAddress"));
const AddBillingAddress = lazy(() => import("./Pages/Sections/AddBillingAddress"));
const PaymentSuccess = lazy(() => import("./Components/PaymentsMethod/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./Components/PaymentsMethod/PaymentFailure"));

const Routing = () => {
  return (
    <>
      <Router history={RoutinHistory}>
        <Suspense
          fallback={
            <div className='loader'>
              <Loader
                type="Rings"
                color="#FFFF00"
                height={100}
                width={180}
                value='Loading'
              />
            </div>
          }
        >

          <Switch>
            <Route exact path="/">
              <Header />
              <Home />
              <Footer />
            </Route>
            <Route path="/product/:name">
              <Header />
              <ProductDetail />
              <Footer />
            </Route>
            <Route path="/shop_grid/:id">
              <Header />
              <Shop_grid />
              <Footer />
            </Route>
            <Route path="/brands/:id">
              <Header />
              <Brands />
              <Footer />
            </Route>
            <Route path="/viewcart">
              <Header />
              <ViewCart />
              <Footer />
            </Route>
            <Route path="/wishlist">
              <Header />
              <WishList />
              <Footer />
            </Route>
            <Route path="/compare">
              <Header />
              <Compare />
              <Footer />
            </Route>
            <Route path="/account">
              <Header />
              <AccountPage />
              <Footer />
            </Route>
            <Route path="/confirmemail">
              <Header />
              <ConfirmEmail />
              <Footer />
            </Route>
            <Route path="/passwordreset">
              <Header />
              <PasswordRest />
              <Footer />
            </Route>
            <Route path="/aboutus">
              <Header />
              <AboutUs />
              <Footer />
            </Route>
            <Route path="/delivery_information">
              <Header />
              <DeliveryInformation />
              <Footer />
            </Route>
            <Route path="/discount">
              <Header />
              <Discount />
              <Footer />
            </Route>
            <Route path="/privacy_policy">
              <Header />
              <PrivacyPolicy />
              <Footer />
            </Route>
            <Route path="/faqs">
              <Header />
              <FAQs />
              <Footer />
            </Route>
            <Route path="/terms_and_condition">
              <Header />
              <TermsAndCondition />
              <Footer />
            </Route>
            <Route path="/news">
              <Header />
              <News />
              <Footer />
            </Route>
            <Route path="/trends">
              <Header />
              <Trends />
              <Footer />
            </Route>
            <Route path="/contact_us">
              <Header />
              <ContactUs />
              <Footer />
            </Route>
            <Route path="/my_orders">
              <Header />
              <MyOrders />
              <Footer />
            </Route>
            <Route path="/thankyou/:refId/:option">
              <div style={{ display: 'none' }}><Header /></div>
              <OrderProvider>
                <ThankYou />
              </OrderProvider>
              <div style={{ display: 'none' }}><Footer /></div>
            </Route>
            <Route path="/return_policy">
              <Header />
              <ReturnPolicy />
              <Footer />
            </Route>
            <Route path="/userinformation">
              <Header />
              <UserInformation />
              <Footer />
            </Route>
            <Route path="/orderlist">
              <Header />
              <OrderList />
              <Footer />
            </Route>
            <Route path="/billingaddress/:id">
              <Header />
              <BillingAddress />
              <Footer />
            </Route>
            <Route path="/addbillingaddress/:id">
              <Header />
              <AddBillingAddress />
              <Footer />
            </Route>
            <Route path="/dashboard">
              <Header />
              <Dashboard />
              <Footer />
            </Route>
            <Route path="/SearchPage/:name">
              <Header />
              <SearchPage />
              <Footer />
            </Route>
            <Route exect path="/checkout">
              <Header />
              <OrderProvider>
                <CheckOut />
              </OrderProvider>
              <Footer />
            </Route>
            <Route exect path="/billinginfo">
              <Header />
              <OrderProvider>
                <Billing />
              </OrderProvider>
              <Footer />
            </Route>
            <Route exect path="/shippinginfo">
              <Header />
              <OrderProvider>
                <Shipping />
              </OrderProvider>
              <Footer />
            </Route>
            <Route exect path="/shippingmethod">
              <Header />
              <OrderProvider>
                <ShippingMethod />
              </OrderProvider>
              <Footer />
            </Route>
            <Route exect path="/paymentinfo">
              <Header />
              <OrderProvider>
                <PaymentInfo />
              </OrderProvider>
              <Footer />
            </Route>
            <Route exect path="/orderreview/:option">
              <Header />
              <OrderProvider>
                <OrderReview />
              </OrderProvider>
              <Footer />
            </Route>
            <Route exect path="/creditcard">
              <Header />
              <OrderProvider>
                <CreditCard />
              </OrderProvider>
              <Footer />
            </Route>
            <Route exect path="/payment/success/:orderId">
              <Header />
              <OrderProvider>
                <PaymentSuccess />
              </OrderProvider>
              <Footer />
            </Route>
            <Route exect path="/payment/failure/:orderId">
              <Header />
              <OrderProvider>
                <PaymentFailure />
              </OrderProvider>
              <Footer />
            </Route>
            <Route exect path="/redirect">
              <Header />
              <OrderProvider>
                <AccountPage />
              </OrderProvider>
              <Footer />
            </Route>
            <Route path='*' exact={true} component={Error} />
          </Switch>

        </Suspense>
      </Router>
    </>
  );
};

export default Routing;
