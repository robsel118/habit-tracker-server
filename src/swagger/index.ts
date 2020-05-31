const spec = {
  openapi: "3.0.0",
  info: {
    title: "Habit-Tracker API",
    description: "This is the documentation regarding the Habit-Tracker API",
    contact: {
      email: "robertleeseligmann@gmail.com",
    },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html",
    },
    version: "1.0.0-oas3",
  },
  servers: [
    {
      url: "https://virtserver.swaggerhub.com/robsel1186/Habit-Tracker/1.0.0",
    },
  ],
  tags: [
    {
      name: "auth",
      description: "Access to authentification services",
    },
    {
      name: "habit",
      description: "Everything regarding management of the user's habit",
    },
    {
      name: "completion",
      description: "Check that a habit has been completed",
    },
    {
      name: "user",
      description: "Where the user can get all his information",
    },
  ],
  paths: {
    "/api/register": {
      post: {
        tags: ["auth"],
        summary: "registers a new user",
        description: "Registers a new User",
        operationId: "registerUser",
        requestBody: {
          description: "user to add",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserObject",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User successfully registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthObject",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
          },
        },
      },
    },
    "/api/login": {
      post: {
        tags: ["auth"],
        summary: "registers a new user",
        description: "logs in an existing User",
        operationId: "logInUser",
        requestBody: {
          description: "user to authenticate",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/body",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User successfully Signed In",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthObject",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
          },
        },
      },
    },
    "/api/habit": {
      get: {
        tags: ["habit"],
        summary: "Fetches user habits",
        description: "Fteches the lsit of all user habits",
        operationId: "fetchHabits",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/HabitObject",
                  },
                },
              },
            },
          },
          "401": {
            description: "Access token is missing or invalid",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      post: {
        tags: ["habit"],
        summary: "Creates a new habit for the user",
        description: "Creates a new habit and assigns it to the user.",
        operationId: "createHabit",
        requestBody: {
          description: "habit to add",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HabitObject",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HabitObject",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
          },
          "401": {
            description: "Access token is missing or invalid",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    "/api/completion": {
      put: {
        tags: ["completion"],
        summary: "Creates or update a completion of a day",
        description: "Add a compited habit on the specific day",
        operationId: "addCompletion",
        requestBody: {
          description: "habit to add",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HabitObject",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompletionObject",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
          },
          "401": {
            description: "Access token is missing or invalid",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    "/api/user/weekly": {
      get: {
        tags: ["user"],
        summary: "Returns habit and weekly completion",
        description:
          "Returns all user habits and the completionsince the beginning of the week",
        operationId: "getWeekly",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/inline_response_200",
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
          },
          "401": {
            description: "Access token is missing or invalid",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
  },
  components: {
    schemas: {
      AuthObject: {
        type: "object",
        properties: {
          token: {
            type: "string",
          },
          user: {
            $ref: "#/components/schemas/UserObject",
          },
        },
      },
      UserObject: {
        required: ["email", "password", "username"],
        type: "object",
        properties: {
          _id: {
            type: "string",
            readOnly: true,
          },
          username: {
            maxLength: 30,
            minLength: 4,
            type: "string",
            example: "JohnDoe",
          },
          email: {
            type: "string",
            example: "john@doe.com",
          },
          password: {
            maxLength: 30,
            minLength: 6,
            type: "string",
            writeOnly: true,
            example: "password1234",
          },
        },
      },
      HabitObject: {
        required: ["frequency", "name"],
        type: "object",
        properties: {
          _id: {
            type: "string",
            readOnly: true,
          },
          name: {
            type: "string",
            example: "Work out",
          },
          not: {
            type: "boolean",
            example: false,
          },
          currentStreak: {
            type: "integer",
            readOnly: true,
            example: 3,
          },
          frequency: {
            type: "array",
            items: {
              type: "integer",
              enum: [0, 1, 2, 3, 4, 5, 6],
            },
          },
        },
      },
      CompletionObject: {
        required: ["habit", "timestamp", "user"],
        type: "object",
        properties: {
          _id: {
            type: "string",
            readOnly: true,
          },
          user: {
            $ref: "#/components/schemas/UserObject",
          },
          habit: {
            $ref: "#/components/schemas/HabitObject",
          },
          date: {
            type: "string",
            example:
              "Sat May 23 2020 00:00:00 GMT+0300 (Eastern European Summer Time)",
          },
        },
      },
      body: {
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
      inline_response_200: {
        type: "object",
        properties: {
          habits: {
            type: "array",
            items: {
              $ref: "#/components/schemas/HabitObject",
            },
          },
          completions: {
            type: "array",
            items: {
              $ref: "#/components/schemas/CompletionObject",
            },
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Access token is missing or invalid",
      },
      BadRequest: {
        description: "Bad Request",
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "bearer",
      },
    },
  },
};

export default spec;
