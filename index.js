const fs = require('fs');
const http = require('http');
const url = require('url');

// SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj= JSON.parse(data);



const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);

    // overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'content-type': 'text.html'});

        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);


        res.end(output);

        // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, {'content-type': 'text.html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

        // API
    } else if (pathname === '/api') {
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(data);
        
        // not found message 
    } else {
        res.writeHead(404, {
            'content-type': 'text/html'
        });
        res.end('<h1>Page not found!</h1>');
    }    
});
server.listen(8000, '127.0.1', () => {
    console.log('listening to requests on port 8000')
});
























// bloccking , synch way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `this is what we know about the avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File has been written!!!!!');

// non blocking aysnc way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     console.log(data);
// });