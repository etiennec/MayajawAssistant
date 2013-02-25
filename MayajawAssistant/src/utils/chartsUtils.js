this.ChartsUtils = {};

ChartsUtils._entityNameColors = {};

ChartsUtils._colorPalette = [
    '#fce94f',
    '#fca3fe',
    '#e9b96e',
    '#8ae234',
    '#729fcf',
    '#ad7fa8',
    '#ef2929',
    '#888a85',
    '#edd400',
    '#f57900',
    '#c17d11',
    '#73d216',
    '#3465a4',
    '#75507b',
    '#cc0000',
    '#d3d7cf',
    '#555753',
    '#c4a000',
    '#ce5c00',
    '#8f5902',
    '#4e9a06',
    '#204a87',
    '#5c3566',
    '#a40000',
    '#babdb6',
    '#2e3436'
];
ChartsUtils._currentColorIndex = 0;


// chartData must be a an array of {Name:"", Value:""} objects
ChartsUtils.createPieChart = function (chartTitle, chartDivElementId, chartData) {

    var dataValues = []

    for (var i = 0; i < chartData.length; i++) {
        var chartRow = chartData[i]
        dataValues.push({name: chartRow.Name, y: chartRow.Value, color: ChartsUtils.getColor(chartRow.Name)})
    }

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: chartDivElementId,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: true
        },
        title: {
            text: chartTitle
        },
        tooltip: {
            pointFormat: '<b>{point.percentage}%</b>',
            percentageDecimals: 0
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function () {
                        return '<b>' + this.point.name + '</b>: ' + this.point.y;
                    }
                }
            }
        },
        series: [
            {
                type: 'pie',
                name: chartTitle,
                data: dataValues
            }
        ]
    });
}

// stackedChartData must be an object like the following:
//{
//  categories: ['cat1', 'cat2', ...]
//  series: [{
//     name: 'label1',
//     data: [1, 42, 809, ...]
// }, {
//     name: 'label2',
//     data: [2, 107, 111, ...]
// }, ... ]
//}
// length of categories & data arrays must be identical.
// Values must NOT be pre-added to each other between categories:
// This function will take care of it without modifying the passed object.
//
ChartsUtils.createStackedAreaChart = function (chartTitle, yLabel, xLabel, chartDivElementId, stackedChartData) {

    // We need to add series values over the categories
    // We don't want to modify the passed object
    var addedSeries = []
    for (var i = 0; i < stackedChartData.series.length; i++) {
        var newSerie = {name: stackedChartData.series[i].name, color: ChartsUtils.getColor(stackedChartData.series[i].name)}
        var newData = []
        newData[0] = stackedChartData.series[i].data[0]
        for (var j = 1; j < stackedChartData.series[i].data.length; j++) {
            newData[j] = newData[j - 1] + stackedChartData.series[i].data[j]
        }
        newSerie.data = newData
        addedSeries.push(newSerie)
    }

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: chartDivElementId,
            type: 'area'
        },
        title: {
            text: chartTitle
        },

        xAxis: {
            categories: stackedChartData.categories,
            tickmarkPlacement: 'on',
            title: {
                text: xLabel
            },
            labels: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: yLabel
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
        },
        legend: {
            enabled: true
        },
        tooltip: {
            formatter: function () {
                return '' + this.series.name + ': ' + this.y + ' ' + yLabel + ' (' + this.x + ')';
            }
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            },
            series: {
                animation: false
            }
        },
        series: addedSeries
    });
}


// stackedChartData must be an object like the following:
//{
//  categories: ['cat1', 'cat2', ...]
//  series: [{
//     name: 'label1',
//     data: [1, 42, 809, ...]
// }, {
//     name: 'label2',
//     data: [2, 107, 111, ...]
// }, ... ]
//}
// length of categories & data arrays must be identical
ChartsUtils.createStackedColumnsChart = function (chartTitle, yLabel, xLabel, chartDivElementId, stackedChartData) {

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: chartDivElementId,
            type: 'column'
        },
        title: {
            text: chartTitle
        },
        xAxis: {
            categories: stackedChartData.categories,
            title: {
                text: xLabel
            },
            labels: {
                enabled: false
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: yLabel
            },
            stackLabels: {
                enabled: true
            }
        },
        legend: {
            enabled: true
        },
        tooltip: {
            formatter: function () {
                return '' +
                    this.series.name + ': ' + this.y + ' ' + yLabel + ' (' + this.x + ')';
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false
                }
            },
            series: {
                animation: false
            }
        },
        series: stackedChartData.series
    });
}

ChartsUtils.getColor = function (entityName) {
    if (ChartsUtils._entityNameColors[entityName] == null) {
        ChartsUtils._entityNameColors[entityName] = ChartsUtils._colorPalette[ChartsUtils._currentColorIndex];
        ChartsUtils._currentColorIndex++;
        if (ChartsUtils._currentColorIndex >= ChartsUtils._colorPalette.length) {
            ChartsUtils._currentColorIndex = 0;
        }
    }

    return ChartsUtils._entityNameColors[entityName];
}
