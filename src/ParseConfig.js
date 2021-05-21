import { Parse } from "parse";
import Loader from 'react-loader-spinner'
import React from 'react';

export const initParseSDK = () => {

    Parse.initialize(
        "QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf",
        "bBTwNypYfhWTYpeDXGr98nxdElMVGjEcxkZY9xBj"
    );
    Parse.serverURL = "https://parseapi.back4app.com/";
    console.log("Please Wait")
}
export const LoaderSet = () => {
    return (
        <div className='loader'>
            <Loader
                type="Rings"
                color="#FFFF00"
                height={100}
                width={180}
                value='Loading'

            />
        </div>
    )
}
