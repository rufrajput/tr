import { Parse } from 'parse';

export const initParseFbSDK = () => {
    let isLoaded = false;
    // wait for facebook sdk to initialize before starting the react app
    window.fbAsyncInit = function () {
        Parse.FacebookUtils.init({
            appId: '424010268596540',
            cookie: true,
            xfbml: true,
            version: 'v8.0'
        });
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '424010268596540',
                cookie: true,
                xfbml: true,
                version: 'v8.0'
            });
        }
        isLoaded = true;
        checkIfLoaded();
    };
    function checkIfLoaded() {
        if (isLoaded) console.debug("Facebook SDK LOADED!");
        else console.debug("Facebook SDK NOT YET LOADED!");
        return false;
    }
    // load facebook sdk script
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}
