const SwaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

module.exports = [SwaggerUi.serve, SwaggerUi.setup(swaggerDoc)];