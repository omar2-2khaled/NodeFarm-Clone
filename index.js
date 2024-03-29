const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

/////////////////////
///////Files/////////
/////////////////////
// const read = fs.readFileSync('./txt/input.txt','utf-8');

// console.log(read);
// const textout =`this is info about rebl : ${read}.\n` ;
// fs.writeFileSync('./txt/output.txt',textout);
// console.log(textout);
// //Non-blocking 
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//                 coasdsafnsole.log(data3);
//                 fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,err=>{
//                     console.log("final Done");
//                 })
//         })
//     });

// });
// console.log('ALL IS WILL');

////////////////
/////server//////
/////////////////.
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%ID%}/g, product.id);
    return output;
}



const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const jsonData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(jsonData);

const server = http.createServer((req, res) => {
    //const pathname = req.url;

    const { query, pathname } = url.parse(req.url, true);
    //console.log( url.parse(req.url,true));

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cardsHtml = dataObj
            .map((element) => replaceTemplate(tempCard, element))
            .join('');
        const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);
        res.end(output);

    }
    //product
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    // API
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(jsonData);
    }
    // ERROR
    else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log("Server is running on http://127.0.0.1:3000");
});