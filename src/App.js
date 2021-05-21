import React from "react";
import Routing from './Routing';

import { CartProvider } from './contextapi/context_cart'
import { WishProvider } from './contextapi/WishListContext'
import { LoginProvider } from './contextapi/LoginContext'
import { CompareProvider } from './contextapi/CompareListContext'
import { initParseSDK } from './ParseConfig';
import {ToggleChat} from './ToggleChat'
import { initParseFbSDK } from './FacebookConfig';
import { BillingProvider } from './contextapi/BillingContext';


const App = () => {

  initParseSDK();
  initParseFbSDK();
  ToggleChat()

  return (
    <div>
      <LoginProvider>
        <CartProvider>
          <WishProvider>
            <CompareProvider>
              <BillingProvider>
                <Routing />
              </BillingProvider>
            </CompareProvider>
          </WishProvider>
        </CartProvider>
      </LoginProvider>
    </div>
  );
};
export default App;
