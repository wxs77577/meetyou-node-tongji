const TongJi  = require('./lib');

module.exports = {
    getInstance: (config) =>  {
        return new TongJi(config)
    }
}