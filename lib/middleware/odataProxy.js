require("dotenv").config()

module.exports = function ({
    resources,
    options
}) {
    const fs = require('fs');
    const httpProxy = require('http-proxy');
    const proxy = new httpProxy.createProxyServer({
        changeOrigin: true,
        secure: false // to avoid Error unable to get local issuer certificate
    });
    const routing = JSON.parse(fs.readFileSync('./routes.json'));

    return function (req, res, next) {
        //console.log(`Received request method: ${req.method} url: ${req.url}`);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID');
        // intercept OPTIONS method
        if ('OPTIONS' === req.method) {
            res.header(200);
            console.log(req.method + '(options): ' + req.url);
            next();
            return;
        }
        var dirname = req.url.replace(/^\/([^\/]*).*$/, '$1'); //get root directory name eg sdk, app, sap
        if (!routing[dirname]) {
            console.log(req.method + ': ' + req.url);
            next();
            return;
        }
        // first resource is a destination name from SCP
        let new_url = req.url.replace(/^\/([^\/]*)(.*$)/, '$2') // get the rest of the url
        req.url = new_url

        // in the original route we replace target and auth from environment variables
        const route = Object.assign(
            Object.assign({}, routing[dirname]), {
            target: process.env[routing[dirname].target] || routing[dirname].target, // can be given directly in routes.json
            auth: process.env[routing[dirname].auth]
        })
        
        // let's see that routing target is a good URL
        try{
            new URL(route.target);
        } catch(e) {
            console.log(`Invalid URL provided for route ${dirname}: ${route.target}`)
            next(e)
        }

        //route.target = process.env[routing[dirname].target]
        //route.auth = process.env[routing[dirname].auth]

        console.log(req.method + ' (redirect): ' + route.target + req.url);
        proxy.web(req, res, route, function (err) {
            if (err) {
                next(err);
            }
        });
    }
};