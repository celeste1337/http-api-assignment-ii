const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

console.log("pp");

//more like assignment 1! fill me out :)
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/success': jsonHandler.success,
    '/badRequest': jsonHandler.badRequest,
    notFound: jsonHandler.notFound,
    '/getUsers': jsonHandler.getUsers,
    '/addUsers': jsonHandler.addUsers,
    '/notReal': jsonHandler.notReal,
  },
  HEAD: {
    //these should all be meta ones! bc no message :)
    '/getUsers': jsonHandler.getUsersMeta,
    '/notReal': jsonHandler.notRealMeta,
    notFound: jsonHandler.notFoundMeta
  },
};

const handlePost = (request, response, parsedUrl) => {
  const res = response;
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    jsonHandler.addUsers(request, res, bodyParams);
  })
}

const onRequest = (request, response) => {
  
  const parsedUrl = url.parse(request.url);
  const params = parsedUrl.query;

  console.log(parsedUrl.pathname);

  if (request.method === "POST" && parsedUrl.pathname === "/addUsers") {
    handlePost(request, response, parsedUrl);
  } else if (urlStruct[request.method][parsedUrl.pathname]){
    urlStruct[request.method][parsedUrl.pathname](request, response, params);
  } else {
    urlStruct.GET.notFound(request, response);
  }

};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);