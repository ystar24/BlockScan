// Required preloads
const request = require('request');
const colors = require('colors');
var argv = require('minimist')(process.argv.slice(2));
var func = require('./functions.js')
const config = require('./config.js');
process.env.TZ = 'Asia/Kolkata';

//App variables
var freq = 600000;
var url = 'https://api.whale-alert.io/v1/transactions';
var count = 0;

console.log('Scanning the blockchain for entries........'.inverse);
var requestLoop = setInterval(() => {
    var now = Math.round((new Date()).getTime() / 1000);
    var ts = now - 610;
    var time = new Date();
    time = time.toLocaleTimeString();
    var cursor;
    var body = '';
    var options = {
        url: url,
        method: 'GET',
        qs: {
            api_key: 'ijwkV0yuUfgRWfCwt7YxEoEl0x9uNziz',
            start: ts,
            min_value: 3500000
        }
    };
    console.log(count);
    count++;
    try {
        request(options, (err, res, body) => {
            if (err) {
                console.log(err);
            } else {
                if (func.isJSON(body)) {
                    body = JSON.parse(body);
                    if (body.result == 'success') {
                        //Do work here
                        console.log(colors.grey(time));
                        if (body.count != 0) {
                            console.log(colors.green(body.count) + ' Transaction(s) are recorded from ' + colors.red(ts) + ' to ' + colors.red(now));
                            body.transactions.forEach((transaction, index) => {
                                //For Each transaction in transactions
                                var trans_type = transaction.transaction_type;
                                var min_val = func.getMinVal(transaction);
                                var fromOwner = func.setFromOwner(transaction);
                                var toOwner = func.setToOwner(transaction);
                                var tx_str = func.findTX(transaction);
                                var trans_amount = transaction.amount_usd;
                                var add_text = '';
                                var alert_text;
                                var type_text;
                                //Set alert icons
                                if(trans_amount < 20000000) {
                                    alert_text = '🔴';
                                } else if (trans_amount < 40000000) {
                                    alert_text = '🚨';
                                } else if (trans_amount < 80000000) {
                                    alert_text = '🚨🚨';
                                } else if ( trans_amount < 100000000) {
                                    alert_text = '🚨🚨🚨';
                                } else if (trans_amount < 300000000) {
                                    alert_text = '🚨🚨🚨🚨';
                                } else if (trans_amount >= 300000000) {
                                    alert_text = '🚨🚨🚨🚨🚨';
                                }

                                if (trans_type == 'transfer') {
                                    type_text = `transferred from ${fromOwner} to ${toOwner}`;
                                } else if (trans_type == 'burn') {
                                    type_text = `burned at ${fromOwner}`;
                                } else if (trans_type == 'mint') {
                                    type_text = `minted at ${toOwner}`;
                                } else {
                                    type_text = `transferred from ${fromOwner} to ${toOwner}`;
                                }

                                if(fromOwner == toOwner && fromOwner != 'Unknown Wallet') {
                                    add_text = ` (Internal transfer)`;
                                }
                                if(transaction.amount_usd > min_val) {
                                    //This is the validated part
                                    //log to console
                                    console.log(`${colors.yellow(transaction.amount)} ${transaction.symbol.toUpperCase()} ($${colors.green(trans_amount)}) transferred from ${colors.yellow(transaction.from.address)} (${fromOwner}) to ${colors.yellow(transaction.to.address)} (${toOwner})`);

                                    //Tweet
                                    config.post('statuses/update', {status: `${alert_text} ${func.formatNumber(transaction.amount)} #${transaction.symbol.toUpperCase()} ($${func.formatNumber(trans_amount)}) ${type_text} ${add_text} \n\n TX: ${tx_str} \n\n #BlockScan #CryptoBot #BlockChain`}, function (err, data, response) {
                                        if(err) {
                                            console.log('Error tweeting'.red);
                                        } else {
                                            console.log('Tweeted.'.blue);
                                            console.log(colors.white('\n-------------------------------------------------------------------------------\n'));
                                        }
                                    });
                                    //VALIDATED PART ENDS
                                } else {
                                    console.log('Transaction(s) recorded, but too small to tweet.'. red);
                                }
                            });
                        //forEach ENDS

                        } else {
                            console.log(body);
                            console.log('No transactions recorded from ' + colors.red(ts) + ' to ' + colors.red(now));
                            console.log(colors.white('-------------------------------------------------------------------------------'));
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.log(colors.red(err.message));
    }
}, freq);