const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SlimMom Backend API",
      version: "1.0.0",
      description: "Documentație completă pentru API-ul SlimMom.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Server local",
      },
      {
        url: "https://slimmom-backend-v2.onrender.com",
        description: "Server live pe Render.com",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Introduceți token-ul JWT în format Bearer.",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/api/*.js"], // Include fișierele unde sunt definite rutele
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;