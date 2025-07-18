// part6/query-anecdotes/server.js

import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Validator middleware with debug logs
const validator = (request, response, next) => {
  console.log('Validator triggered with body:', request.body);  // Debugging log

  const { content } = request.body;

  // Ensure content is not too short for POST requests
  if (request.method === 'POST' && (!content || content.length < 5)) {
    console.log('Validation failed: Content is too short');
    return response.status(400).json({
      error: 'too short anecdote, must have length 5 or more'
    });
  }
  next();  // Continue to the next middleware (json-server router)
};

// Middleware order: (body parser, validator, default middlewares, router)
server.use(jsonServer.bodyParser);  // Parse request body before anything else
server.use(validator);  // Custom validation middleware
server.use(middlewares);  // Default middlewares (logging, static, etc.)
server.use(router);  // Attach the router to handle routes

server.listen(3001, () => {
  console.log('JSON Server is running');
});
