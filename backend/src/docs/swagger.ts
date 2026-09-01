import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Instant Mechanic API",
      version: "1.0.0",
      description: "Live vehicle service operations dashboard API",
    },
    servers: [{ url: "http://localhost:4000", description: "Local dev" }],
  },
  apis: ["./src/routes/*.ts"], // reads JSDoc comments from route files
});