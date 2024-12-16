const swaggerJSDoc = require("swagger-jsdoc");

// Configurarea Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SlimMom Backend API",
      version: "1.0.0",
      description: "Documentație completă pentru API-ul SlimMom Backend.",
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
  },
  apis: ["./routes/api/*.js"], // Include toate fișierele de rute
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
