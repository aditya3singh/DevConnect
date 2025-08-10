const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevConnect API Documentation',
      version: '1.0.0',
      description: 'API documentation for the DevConnect platform',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@devconnect.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            avatar: { type: 'string' },
            bio: { type: 'string' },
            skills: { type: 'array', items: { type: 'string' } },
          },
        },
        Post: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            type: { type: 'string', enum: ['article', 'question', 'project', 'resource'] },
            tags: { type: 'array', items: { type: 'string' } },
            media: { type: 'array', items: { type: 'string' } },
          },
        },
        Project: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['planning', 'in-progress', 'completed', 'on-hold'] },
            visibility: { type: 'string', enum: ['public', 'private'] },
          },
        },
        Message: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            receiver: { type: 'string' },
            attachments: { type: 'array', items: { type: 'string' } },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
