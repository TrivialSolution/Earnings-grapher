var earningsChart;
var showLines = true;

var originalDatasets = [];

function fetchEarnings() {
    var ticker = document.getElementById("ticker").value;

    var apiKey = '6KGDHDCK8Y9B9G2Q';

    var xhr = new XMLHttpRequest();
    var url = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${ticker}&apikey=${apiKey}`;
    xhr.open('GET', url, true);
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
                pointStyle: 'circle',
                pointBackgroundColor: 'blue',
                originalOptions: {
                    borderColor: 'blue',
                    pointBackgroundColor: 'blue'
                }
            }, {
                label: 'Earnings Estimates',
                data: earningsEstimates,
                borderColor: 'green',
                fill: false,
                pointStyle: 'circle',
                pointBackgroundColor: 'green',
                originalOptions: {
                    borderColor: 'green',
                    pointBackgroundColor: 'green'
                }
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
                    tension: 0,
                    borderWidth: showLines ? 2 : 0
                },
                point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 5
                }
            },
            plugins: {
                legend: {
                    labels: {
                        generateLabels: function(chart) {
                            var labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            labels.forEach(function(label) {
                                var dataset = chart.data.datasets[label.datasetIndex];
                                if (label.datasetIndex === 0) {
                                    label.fillStyle = dataset.borderColor;
                                } else if (label.datasetIndex === 1) {
                                    label.fillStyle = dataset.borderColor;
                                }
                            });
                            return labels;
                        }
                    }
                }
            }
        }
    });

    originalDatasets = earningsChart.data.datasets.map(dataset => ({
        borderColor: dataset.borderColor,
        pointStyle: dataset.pointStyle,
        pointBackgroundColor: dataset.pointBackgroundColor
    }));
}

function toggleLines() {
    showLines = !showLines;

    earningsChart.data.datasets.forEach((dataset, index) => {
        dataset.borderWidth = showLines ? 2 : 0;
        dataset.hitRadius += showLines ? -1 : 1;
        // dataset.radius += showLines ? -1 : 1;
        dataset.hoverRadius += showLines ? -1 : 1;
    });

    earningsChart.update();
}
