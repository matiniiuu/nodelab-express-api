import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { envVariables } from "@src/config";
import { log } from "@src/helpers";
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version: "1.0.0",
            description: "API documentation using Swagger",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes", "../../domain/entities", "../../dto"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express) {
    app.use(["/docs", "/docs.json"], (req, res, next) => {
        const { authorization } = req.headers;

        const expectedCredentials = Buffer.from(
            `${envVariables.SWAGGER_USERNAME}:${envVariables.SWAGGER_PASSWORD}`,
        ).toString("base64");

        if (
            !authorization ||
            authorization !== `Basic ${expectedCredentials}`
        ) {
            res.setHeader("WWW-Authenticate", 'Basic realm="Swagger"');
            return res.status(401).send("Unauthorized");
        }

        next();
    });
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    log.info(`Docs available at /docs`);
}

export default swaggerDocs;
