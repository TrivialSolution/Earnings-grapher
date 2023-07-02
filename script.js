var earningsChart;
var apiKey = '6KGDHDCK8Y9B9G2Q';
var showLines = true;

var originalDatasets = [];

function fetchEarnings() {
    var ticker = document.getElementById("ticker").value;

    var xhr = new XMLHttpRequest();
    var url = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${ticker}&apikey=${apiKey}`;
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var earningsData = data.quarterlyEarnings;

            var endingDates = [];
            var reportDates = [];
            var actualEarnings = [];
            var earningsEstimates = [];
            var surprises = [];
            var surprisePercents = [];

            for (var i = 0; i < earningsData.length; i++) {
                endingDates.push(earningsData[i].fiscalDateEnding);
                reportDates.push(earningsData[i].reportedDate);
                actualEarnings.push(parseFloat(earningsData[i].reportedEPS).toFixed(2));
                earningsEstimates.push(parseFloat(earningsData[i].estimatedEPS).toFixed(2));

                var surprise = parseFloat(earningsData[i].surprise).toFixed(2);
                if (surprise > 0)
                    surprise = '+' + surprise;
                surprises.push(surprise);

                var surprisePercentage = parseFloat(earningsData[i].surprisePercentage).toFixed(0);
                if (surprisePercentage > 0)
                    surprisePercentage = '+' + surprisePercentage;
                surprisePercentage += '%';
                surprisePercents.push(surprisePercentage);
            }

            renderChart(endingDates, actualEarnings, earningsEstimates);
            renderTable(endingDates, reportDates, actualEarnings, earningsEstimates, surprises, surprisePercents);
        }
    };
    xhr.send();

    // Show the "Toggle Lines" button after fetching earnings data
    document.getElementById("toggleButtonContainer").style.display = "block";

    // Show the table after fetching earnings data
    document.getElementById("earningsTable").style.display = "table";
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

function renderTable(endingDates, reportDates, actualEarnings, earningsEstimates, surprises, surprisePercents) {
    var tableBody = document.getElementById("earningsTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    for (var i = 0; i < endingDates.length; i++) {
        var row = tableBody.insertRow(i);
        var endingDateCell = row.insertCell(0);
        var reportDateCell = row.insertCell(1);
        var actualEarningsCell = row.insertCell(2);
        var earningsEstimatesCell = row.insertCell(3);
        var surpriseCell = row.insertCell(4);
        var surprisePercentsCell = row.insertCell(5);

        endingDateCell.innerHTML = endingDates[i];
        reportDateCell.innerHTML = reportDates[i];
        actualEarningsCell.innerHTML = actualEarnings[i];
        earningsEstimatesCell.innerHTML = earningsEstimates[i];
        surpriseCell.innerHTML = surprises[i];
        surprisePercentsCell.innerHTML = surprisePercents[i];
    }
}

function toggleLines() {
    showLines = !showLines;

    earningsChart.data.datasets.forEach((dataset, index) => {
        dataset.borderWidth = showLines ? 2 : 0;
        // dataset.radius += showLines ? -5 : 5;
        // dataset.hitRadius += showLines ? -1 : 1;
        // dataset.hoverRadius += showLines ? -1 : 1;
    });

    earningsChart.update();
}

function saveKey() {
    apiKey = document.getElementById("customKey").value;
}
