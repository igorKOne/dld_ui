https = require('https')
fs = require('fs')
routing = JSON.parse(fs.readFileSync('./routing.json'))

//dest = routing.es5 || routing.sap

module.exports = (req, res, next) => {

    const dirname = req.url.replace(/^\/([^\/]*).*$/, '$1') //get root directory name eg sdk, app, sap
    const path = req.url.replace(/^\/([^\/]*)(.*$)/, '$2') // get the rest of the url

    dest = routing[dirname]

    if(!dest){
        next()
        return
    }

    const host = dest.target.replace(/https?:\/\/([\w.]*)/gm,'$1')

    let postData = null
    const methods_w_body = ['POST','PUT','PATCH','MERGE']
    if(methods_w_body.includes(req.method)){
        //postData = req.body
        //let body = ''
        req.on('data', chunk => {
            //body += chunk.toString() // convert Buffer to string
            writeToReq(chunk)
        });
        req.on('end', () => {
            //console.log(body)
            endReq()
        });
    }

    // allowed request headers to pass to the backend service
    let header_list = [
        'content-type',
        'accept',
        'x-csrf-token',
        'connection',
        'accept-encoding',
        'accept-language',
        'content-length',
        'content-transfer-encoding',
        'referer',
        'origin',
        'sec-fetch-mode',
        // SAP specific
        'sap-cancel-on-close',
        'sap-contextid-accept',
        // OData specific
        'dataserviceversion',
        'maxdataserviceversion'
    ]
    let headers = copyHeaders(req.headers,header_list)
    headers['Authorization'] = 'Basic ' + Buffer.from(dest.auth).toString('base64') //new Buffer(dest.auth).toString('base64')

    const options = {
        host,
        path,
        method: req.method,
        headers
    }

    const creq = https.request(options, (cres) => {
        //console.log(`statusCode: ${cres.statusCode}`)
        resHeaders = copyHeaders(cres.headers)
        res.writeHead(cres.statusCode, resHeaders)

        cres.on('data', d => {
            //process.stdout.write(d)
            res.write(d)

        })
        cres.on('end', () => {
            res.end()
        })
        cres.on('close', () => {
            res.end()            
        })
    })

    creq.on('error', error => {
        console.log(error)
        //res.writeHead(500)
        //res.end()
        next(error)
    })

    function writeToReq(postData){
        creq.write(postData);
    }

    function endReq(){
        creq.end()
    }

    if(!methods_w_body.includes(req.method)){
        creq.end()
    }


}

function copyHeaders(in_headers, header_list=[]) {
    out_headers = {}
    for (h in in_headers) {
        lh = h.toLowerCase()
        if (in_headers.hasOwnProperty(h) && (header_list.length == 0 || header_list.includes(lh))) {
            out_headers[h] = in_headers[h]
        }
    }
    return out_headers
}
