const fs = require('fs');
const path = './webapp/';
let fileName = 'index.html';
fs.readFile(path + fileName, callbackRead(fileName, substituteSrcIndexHtml));

fileName = 'manifest.json';
fs.readFile(path + fileName, callbackRead(fileName, substituteURIManifestJson));

function callbackRead(fileName, fnSubst) {
    return function (e, data) {
        if (e) {
            throw e;
        }
        console.log(`Reading file ${fileName}`);
        //console.log('source File:\n' + data.toString());

        // Backup original file
        saveFile('bkp_' + fileName, data);

        console.log(`Substituting URIs in ${fileName}`);
        let result = fnSubst(data);

        // console.log('Substitution result:\n', result);
        // save new file
        saveFile(fileName, result);
    }
}

function substituteSrcIndexHtml(data) {

    // replace local references to sap-ui-core.js to SAPUI5 CDN
    const regex = /(src=")([\.\/]*)(\/resources\/sap-ui-core\.js")/gm;
    const subst = `$1https://sapui5.hana.ondemand.com$3`;

    let str = data.toString();

    // The substituted value will be contained in the result variable
    return result = str.replace(regex, subst);
}

function substituteURIManifestJson(data) {
    const regex = /("uri")\s*:\s*"([\/\w]*)(\/services\/.*)"/gm;

    let str = data.toString();
    const subst = `$1: "../..$3"`;

    // The substituted value will be contained in the result variable
    return result = str.replace(regex, subst);
}

function saveFile(fileName, data) {
    fs.writeFile(path + fileName, data, (e) => {
        if (e) {
            console.log('Error writing file', e)
        } else {
            console.log('Successfully wrote file ' + path + fileName)
        }
    })
}