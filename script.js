var earningsChart;
var showLines = true;

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

            var dates = [];
            var actualEarnings = [];
            var earningsEstimates = [];

            for (var i = 0; i < earningsData.length; i++) {
                dates.push(earningsData[i].fiscalDateEnding);
                actualEarnings.push(parseFloat(earningsData[i].reportedEPS));
                earningsEstimates.push(parseFloat(earningsData[i].estimatedEPS));
            }

            renderChart(dates, actualEarnings, earningsEstimates);
        }
    };

    // Send the request
    xhr.send();
}

function renderChart(dates, actualEarnings, earningsEstimates) {
    var ctx = document.getElementById("earningsChart").getContext("2d");

    if (earningsChart) {
        earningsChart.destroy();
    }

    earningsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Actual Earnings',
                data: actualEarnings,
                borderColor: 'blue',
                fill: false,
                borderWidth: showLines ? 2 : 0
            }, {
                label: 'Earnings Estimates',
                data: earningsEstimates,
                borderColor: 'green',
                fill: false,
                borderWidth: showLines ? 2 : 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Quarter End Date'
                    },
                    reverse: true
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Earnings (in Dollars)'
                    }
                }
            },
            elements: {
                line: {
                    tension: 0, // Remove lines between data points
                    borderWidth: 2 // Set line width to distinguish data points
                },
                point: {
                    radius: 4, // Set point radius to make data points more visible
                    hitRadius: 10,
                    hoverRadius: 5
                }
            }
        }
    });
}

function toggleLines() {
    showLines = !showLines;
    renderChart(earningsChart.data.labels, earningsChart.data.datasets[0].data, earningsChart.data.datasets[1].data);
}
