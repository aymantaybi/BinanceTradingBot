const tulind = require('tulind');

class BinanceChart {

    constructor(client) {
        this.client = client;
        this.all = {};
    }

    async open(symbol, interval) {

        if (!this.all[symbol]?.[interval]) {
            this.all[symbol] = this.all[symbol] || {};
            this.all[symbol][interval] = this.all[symbol][interval] || {
                candles: [],
                callbacks: {
                    onChange: () => { },
                    onClose: () => { }
                },
                current: null,
                closed: null
            };
            this.all[symbol][interval].candles = await this.client.candles({ symbol, interval });
        }

        this.client.ws.candles(symbol, interval, candle => {

            var candles = updateCandles(candle, this.all[symbol][interval].candles);

            this.all[symbol][interval].candles = candles;
            this.all[symbol][interval].current = candle;
            this.all[symbol][interval].closed = candle.isFinal ? candle : candles.reverse().find(candle => candle.isFinal == true);

            executeOnChangeCallback(this.all[symbol][interval].callbacks.onChange, candle);
            executeOnCloseCallback(this.all[symbol][interval].callbacks.onClose, candle);
        })

        return {
            "candles": {
                "all": () => this.all[symbol][interval].candles,
                "current": () => this.all[symbol][interval].current,
                "closed": () => this.all[symbol][interval].closed,
                "onChange": (callback) => { this.all[symbol][interval].callbacks.onChange = callback },
                "onClose": (callback) => { this.all[symbol][interval].callbacks.onClose = callback }
            },
            "indicators": {
                "get": (name, input, options) => {
                    var data = [];
                    tulind.indicators[name].indicator(input, options, (error, result) => {
                        if (error) return console.log(error);
                        data = result;
                    });
                    return data;
                }
            }
        }
    }
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

function executeOnChangeCallback(callback, candle) {
    callback(candle);
}

function executeOnCloseCallback(callback, candle) {
    if (!candle.isFinal) return;
    callback(candle);
}

module.exports = BinanceChart;