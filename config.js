const Twit = require('twit');


var T = new Twit({
    consumer_key:         'MtotcRV6YuafUEAnTsMwSRyms',
    consumer_secret:      'JbQaULcnOhNKd4p7uDboAIvTjEhtOp7hJA7jNA4bKBWUzdFNXf',
    access_token:         '1170632159628914689-d6snIESHQAotrHTnILZPfMsE6AOYop',
    access_token_secret:  'VRBaL4CDaQXz7BcQW8NA0KsL0xjoRO9TlFpTYwtaFY0ci',
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

module.exports = T;