const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const bodyParams = query.parse(bodyString);

        handler(request, response, bodyParams);
    });
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addUser') {
        parseBody(request, response, jsonHandler.addUser);
    }
};

// handle GET requests
const handleGet = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
    } else if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
    } else if (parsedUrl.pathname === '/getUsers') {
        jsonHandler.getUsers(request, response);
    } else if (parsedUrl.pathname === '/notReal') {
        jsonHandler.notFound(request, response);
    } else {
        jsonHandler.notFound(request, response);
    }
};

const handleHead = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/getUsers') {
        jsonHandler.getUsersMeta(request, response);
    } else if (parsedUrl.pathname === '/notReal') {
        jsonHandler.notFoundMeta(request, response);
    } else {
        jsonHandler.notFoundMeta(request, response);
    }
};

const onRequest = (request, response) => {
    // parse url into individual parts
    // returns an object of url parts by name
    const parsedUrl = url.parse(request.url);

    // check if method was POST, otherwise assume GET
    // for the sake of this example
    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
    } else if (request.method === 'GET') {
        handleGet(request, response, parsedUrl);
    } else {
        handleHead(request, response, parsedUrl);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});
