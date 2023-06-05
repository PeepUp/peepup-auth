const schema = {
   type: "object",
   required: [],
   properties: {
      WHITE_LISTED_DOMAINS: {
         type: "array",
         default: ["http://localhost:3000"],
      },
      PORT: {
         type: "number",
         default: 4334,
      },
      CLIENT_ORIGIN: {
         type: "string",
         default: "http://localhost:3000",
      },
      NODE_ENV: {
         type: "string",
         default: "development",
      },
      DATABASE_URL: {
         type: "string",
         default: "postgres://postgres:postgres@localhost:5432/postgres",
      },
      DATABASE_URL_TEST: {
         type: "string",
         default: "postgres://postgres:postgres@localhost:5432/postgres",
      },
      DATABASE_URL_PROD: {
         type: "string",
         default: "postgres://postgres:postgres@localhost:5432/postgres",
      },
      DATABASE_URL_DEV: {
         type: "string",
         default: "postgres://postgres:postgres@localhost:5432/postgres",
      },
      DATABASE_URL_LOCAL: {
         type: "string",
         default: "postgres://postgres:postgres@localhost:5432/postgres",
      },
      DATABASE_URL_DOCKER: {
         type: "string",
         default: "postgres://postgres:postgres@localhost:5432/postgres",
      },
      DATABASE_PASSWORD: {
         type: "string",
         default: "",
      },
      DATABASE_USER: {
         type: "string",
         default: "",
      },
      DATABASE_NAME: {
         type: "string",
         default: "",
      },
   },
};

const environment = {
   confKey: "config",
   dotenv: true,
   schema,
   data: process.env,
};

export default environment;
