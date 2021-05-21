import React from 'react';

const PlainString = (html) => {
        let divContainer = document.createElement("div");
        divContainer.innerHTML = html;
        // console.log('html: ',typeof html);
        return divContainer.textContent || divContainer.innerText || "";
}

export default PlainString;