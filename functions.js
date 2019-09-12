//Check isJSON
function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function setFromOwner(obj) {
    if (obj.from.owner_type == 'unknown') {
        return 'Unknown Wallet';
    } else {
        return `#${obj.from.owner}`;
    }
}

function setToOwner(obj) {
    if (obj.to.owner_type == 'unknown') {
        return 'Unknown Wallet';
    } else {
        return `#${obj.to.owner}`;
    }
}

function findTX(obj) {
    var tx;
    switch (obj.blockchain) {
        case 'bitcoin':
            tx = `https://www.blockchain.com/btc/tx/${obj.hash}`;
            return tx;
            break;
        case 'ethereum':
            tx = `https://etherscan.io/tx/0x${obj.hash}`;
            return tx;
            break;
        case 'stellar':
            tx = `https://stellarchain.io/tx/${obj.hash}`;
            return tx;
            break;
        case 'eos':
            tx = `https://bloks.io/transaction/${obj.hash}`;
            return tx;
            break;
        case 'ripple':
            tx = `https://bithomp.com/explorer/${obj.hash}`;
            return tx;
            break;
    }
}

function getMinVal(obj) {
    var min_val;
    switch (obj.blockchain) {
        case 'bitcoin':
            min_val = 10000000;
            return min_val;
            break;
        case 'ethereum':
            min_val = 5000000;
            return min_val;
            break;
        case 'stellar':
            min_val = 2000000;
            return min_val;
            break;
        case 'eos':
            min_val = 2000000;
            return min_val;
            break;
        case 'ripple':
            min_val = 9000000;
            return min_val;
            break;
    }
}



module.exports.isJSON = isJSON;
module.exports.formatNumber = formatNumber;
module.exports.setFromOwner = setFromOwner;
module.exports.setToOwner = setToOwner;
module.exports.findTX = findTX;
module.exports.getMinVal = getMinVal;