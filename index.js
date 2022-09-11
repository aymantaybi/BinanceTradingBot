
var tab = [5, 2, 9, 3, 7, 3, 12, 9]



for (var i = 0; i < tab.length; i++) {
    console.log(tab[i])
}












**
const Binance = require('binance-api-node').default;
const BinanceChart = require("./src/BinanceChart");

const client = Binance();

(async () => {

    var binanceChart = new BinanceChart(client);

    var symbol = "ETHUSDT";

    var interval = "1m";

    var ETHUSDT_1m_Chart = await binanceChart.open(symbol, interval);

    ETHUSDT_1m_Chart.candles.onChange((currentCandle) => {

        var candles = ETHUSDT_1m_Chart.candles.all();

        var opens = candles.map(element => element.open);
        var highes = candles.map(element => element.high);
        var lows = candles.map(element => element.low);
        var closes = candles.map(element => element.close);

        var stoch = ETHUSDT_1m_Chart.indicators.get("stoch", [highes, lows, closes], [14, 3, 3]);
        var ema = ETHUSDT_1m_Chart.indicators.get("ema", [closes], [100]);

        console.log(stoch);

        //console.log("current : " + ETHUSDT_1m_Chart.candles.current());
    });

    ETHUSDT_1m_Chart.candles.onClose((closedCandle) => {
        console.log("closed : " + ETHUSDT_1m_Chart.candles.closed());
    });

})()

