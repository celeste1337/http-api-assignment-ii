const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status, type) => {
  const headers = {
    'Content-Type': type,
  };

  response.writeHead(status, headers);
  response.end();
};

const success = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  respondJSON(request, response, 200, responseJSON);
};

const getSuccessMeta = (request, response, type) => respondJSONMeta(request, response, 200, type);

const badRequest = (request, response, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response, type) => respondJSONMeta(request, response, 404, type);

const getUsers = (request, response) => {
  // should default to good
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response, type) => respondJSONMeta(request, response, 200, type);

const addUsers = (request, response, body) => {
  const responseJSON = {
    message: 'name n age r required',
  };

  if (!body.name || !body.age) {
    respondJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'created successfully!';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  console.log('added');

  return respondJSONMeta(request, response, responseCode);
};

const notReal = (request, response) => {
  // should default to good
  const responseJSON = {
    message: 'This was successfully not found',
    id: 'notFound',
  };

  respondJSON(request, response, 200, responseJSON);
};

const notRealMeta = (request, response, type) => respondJSONMeta(request, response, 404, type);

// dont forget to add the meta ones
module.exports = {
  success,
  getSuccessMeta,
  badRequest,
  notFound,
  notFoundMeta,
  getUsers,
  getUsersMeta,
  addUsers,
  notReal,
  notRealMeta,
};
