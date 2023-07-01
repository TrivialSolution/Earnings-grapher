function fetchEarnings() {
    var ticker = document.getElementById("ticker").value;

    // Replace 'YOUR_API_KEY' with your actual AlphaVantage API key
    var apiKey = '6KGDHDCK8Y9B9G2Q';

    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Construct the API URL
    var url = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${ticker}&apikey=${apiKey}`;

    // Set the request method and URL
    xhr.open('GET', url, true);

    // Define the onload callback function
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var earningsData = data.quarterlyEarnings;

            var earningsTable = document.getElementById("earningsBody");
            earningsTable.innerHTML = "";

            for (var i = 0; i < earningsData.length; i++) {
                var row = earningsTable.insertRow(i);
                var dateCell = row.insertCell(0);
                var actualEarningsCell = row.insertCell(1);
                var earningsEstimateCell = row.insertCell(2);

                dateCell.innerHTML = earningsData[i].fiscalDateEnding;
                actualEarningsCell.innerHTML = earningsData[i].reportedEPS;
                earningsEstimateCell.innerHTML = earningsData[i].estimatedEPS;
            }
        }
    };

    // Send the request
    xhr.send();
}
