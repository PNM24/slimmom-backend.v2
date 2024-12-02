const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          required: [
            "title",
            "weight",
            "calories",
            "categories",
            "groupBloodNotAllowed",
          ],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the product",
            },
            title: { type: "string", description: "The title of the product" },
            weight: {
              type: "number",
              description: "The weight of the product",
            },
            calories: {
              type: "number",
              description: "The calories of the product",
            },
            categories: {
              type: "array",
              items: { type: "string" },
              description: "The categories of the product",
            },
            groupBloodNotAllowed: {
              type: "object",
              properties: {
                1: { type: "boolean" },
                2: { type: "boolean" },
                3: { type: "boolean" },
                4: { type: "boolean" },
              },
              description:
                "The blood type groups for which the product is not allowed",
            },
          },
        },
        ConsumedProduct: {
          type: "object",
          required: ["userId", "productId", "date", "quantity"],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the consumed product",
            },
            userId: {
              type: "string",
              description: "The id of the user who consumed the product",
            },
            productId: { type: "string", description: "The id of the product" },
            date: {
              type: "string",
              format: "date",
              description: "The date when the product was consumed",
            },
            quantity: {
              type: "number",
              description: "The quantity of the product consumed",
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/api/*.js"], // Calea către fișierele cu rute
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };

/**
 * Pornește serverul și accesează documentația API la adresa:
 *  http://localhost:3000/api-docs.
 */
