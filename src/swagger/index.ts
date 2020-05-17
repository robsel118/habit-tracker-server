const spec = {
  swagger: "2.0",
  info: {
    description: "This is the documentation regarding the Habit-Tracker API",
    version: "1.0.0",
    title: "Habit-Tracker API",
    contact: {
      email: "robertleeseligmann@gmail.com",
    },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  host: "virtserver.swaggerhub.com",
  basePath: "/robsel1186/Habit-Tracker/1.0.0",
  tags: [
    {
      name: "users",
      description: "Available for the user of the",
    },
    {
      name: "developers",
      description: "Operations available to regular developers",
    },
  ],
  schemes: ["https"],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["users"],
        summary: "registers a new user",
        description: "Registers a new User",
        operationId: "registerUser",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "User",
            description: "user to add",
            required: false,
            schema: {
              $ref: "#/definitions/UserObject",
            },
          },
        ],
        responses: {
          "200": {
            description: "User successfully registered",
            schema: {
              $ref: "#/definitions/inline_response_200",
            },
          },
          "400": {
            description:
              "E-mail already registered OR Invalid email or password",
          },
        },
      },
    },
    "/api/auth": {
      post: {
        tags: ["users"],
        summary: "registers a new user",
        description: "logs in an existing User",
        operationId: "logInUser",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "user",
            description: "user to authenticate",
            required: false,
            schema: {
              $ref: "#/definitions/user",
            },
          },
        ],
        responses: {
          "200": {
            description: "User successfully Signed In",
            schema: {
              $ref: "#/definitions/inline_response_200",
            },
          },
        },
      },
    },
  },
  definitions: {
    UserObject: {
      type: "object",
      required: ["email", "password", "username"],
      properties: {
        username: {
          type: "string",
          example: "JohnDoe",
          minLength: 4,
          maxLength: 30,
        },
        email: {
          type: "string",
          example: "john@doe.com",
        },
        password: {
          type: "string",
          example: "password1234",
          minLength: 6,
          maxLength: 30,
        },
      },
    },
    inline_response_200_user: {
      type: "object",
      properties: {
        _id: {
          type: "string",
        },
        username: {
          type: "string",
        },
        email: {
          type: "string",
        },
      },
    },
    inline_response_200: {
      type: "object",
      properties: {
        token: {
          type: "string",
          description: "the JWT token.",
        },
        user: {
          $ref: "#/definitions/inline_response_200_user",
        },
      },
    },
    user: {
      properties: {
        email: {
          type: "string",
          example: "john@doe.com",
        },
        password: {
          type: "string",
          example: "password1234",
        },
      },
    },
  },
};

export default spec;
