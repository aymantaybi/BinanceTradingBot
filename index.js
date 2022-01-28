const Binance = require('binance-api-node').default;
const tulind = require('tulind');

const client = Binance();

const indicators = { stoch: [], rsi: [], macd: [] };

const status = {
    stoch: {
        previous: "neutral",
        current: "neutral"
    },
    rsi: {
        previous: "neutral",
        current: "neutral"
    },
    macd: {
        previous: "neutral",
        current: "neutral"
    },
};

var symbol = "ETHUSDT";

var interval = "1m";

client.candles({ symbol, interval }).then(candles => {

    client.ws.candles(symbol, interval, candle => {

        candles = updateCandles(candle, candles);

        var opens = candles.map(element => element.open);
        var highes = candles.map(element => element.high);
        var lows = candles.map(element => element.low);
        var closes = candles.map(element => element.close);

        tulind.indicators.stoch.indicator([highes, lows, closes], [14, 3, 3], (error, result) => {
            if (error) return console.log(error);
            console.log("Stoch : " + result[0][result[0].length - 1]);
            indicators.stoch = result;
        });

        tulind.indicators.rsi.indicator([closes], [14], (error, result) => {
            if (error) return console.log(error);
            console.log("RSI : " + result[0][result[0].length - 1]);
            indicators.rsi = result;
        });

        tulind.indicators.macd.indicator([closes], [8, 21, 5], (error, result) => {
            if (error) return console.log(error);
            console.log("MACD : " + result[2][result[0].length - 1]);
            indicators.macd = result;
        });

    })

})

function main(candles) { /// here goes our startegy :




}

function updateCandles(candle, candles) {

    var oldCandleIndex = candles.findIndex(oldCandle => oldCandle.startTime == candle.startTime);

    if (oldCandleIndex > -1) {
        candles.splice(oldCandleIndex, 1, candle);
    } else {
        candles.push(candle);
    }

    return candles;
} 