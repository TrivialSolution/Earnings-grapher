## Live Site

You can access a live version of the site [here](eps.matthewachandler.com).

## How to use

Simply enter in the stock ticker for any publicly traded company (case insensitive), and the page will generate a graph and table of the complete earnings history for that company.

<img src="https://github.com/Matthew-Chandler/EPS-View/assets/48606413/7f71a993-cfb0-4863-ab00-17e8cabcbcf0" width="auto" height="300">
<img src="https://github.com/Matthew-Chandler/EPS-View/assets/48606413/2f1fd090-f23d-4b9b-9be2-1afb77b33776" width="auto" height="300">


## API use limit

The Alpha Vantage API free tier only allows 25 requests per day per client IP, so the site will not load new data if too many people use the website in a day without providing their own key.

To mitigate this, at the bottom of the webpage you can enter in your own Alpha Vantage API key, which you can generate for free on the [Alpha Vantage website](https://www.alphavantage.co/support/#api-key). The key is saved to your browser's cookies, so you do not have to enter it every time. This will allow you to generate up to 25 graphs/tables per day without having to share the proxy server's limit with other users.

<img src="https://github.com/Matthew-Chandler/EPS-View/assets/48606413/6b2ec6a6-1439-403f-9f41-35bbc6593645" width="500" height="auto">
