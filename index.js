import request from "request-promise";
import colors from "colors";

function RecursiveCall() {

    let quadrigacx = request({
        url: "https://api.quadrigacx.com/v2/ticker?book=eth_cad",
        json: true
    }).then(function (data) {
        return Promise.resolve(data);
    });

    let cryptowat = request({
        url: "https://api.cryptowat.ch/markets/bitfinex/ethusd/price",
        json: true
    }).then(function (data) {
        return Promise.resolve(data);
    })

    let remitano = request({
        url: "https://eth.remitano.com/api/v1/offers?offer_type=buy&country_code=vn&coin_currency=eth&offline=false&page=1",
        json: true
    }).then(function (data) {
        return Promise.resolve(data);
    })

    let coinsquare = request({
        url: "https://coinsquare.io/api/v1/data/quotes",
        json: true
    }).then(function (data) {
        return Promise.resolve(data);
    })

    Promise.all([quadrigacx, cryptowat, remitano, coinsquare]).then(res => {
        console.log("here");

        // Quadrigacx
        let quadrigacx_price = res[0].ask;

        // Cryptowat
        let cryptowat_price = res[1].result.price * 1.25;

        // Remitano
        let min = 1000000000;

        for (let i = 0; i < res[2].offers.length; i++) {
            if (res[2].offers[i].price < min) {
                min = res[2].offers[i].price;
            }
        }

        let remitano_price = min * res[1].result.price;

        // Coinsquare

        let btc_cad = res[3].quotes.filter(e => e.ticker == 'BTC' && e.base == 'CAD');

        let eth_btc = res[3].quotes.filter(e => e.ticker == 'ETH' && e.base == 'BTC');

        let coinsquare_price = btc_cad[0].ask / 1000 * eth_btc[0].bid / 10000000;

        let ask_price = coinsquare_price > quadrigacx_price ? quadrigacx_price : coinsquare_price;

        console.log(colors.red("Quadrigacx: " + quadrigacx_price)
            + colors.magenta(", Coinsquare: " + coinsquare_price)
            + colors.green(", Crytowat:" + cryptowat_price)
            + colors.magenta(", Remitano:" + remitano_price + "VND"
                + colors.red(", Profit: " + remitano_price / ask_price / 18600)));
    }).catch(err => {
        console.log(err);
    })
}

RecursiveCall();

setInterval(RecursiveCall, 20000);
