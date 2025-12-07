import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Digilehti API",
            version: "1.0.0",
            description: "Backend REST API documentation"
        }
    },
    apis: ['./Routes/*.js'] // files with API annotations
}

export const specs = swaggerJsdoc(options)
export const ui = swaggerUi
