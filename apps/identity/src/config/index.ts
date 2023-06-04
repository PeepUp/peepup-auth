const env: NodeJS.ProcessEnv = process.env;
export const node_env = env.NODE_ENV ?? "development";

const schema = {
   type: "object",
   required: [],
   properties: {
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
   schema: schema,
   dotenv: {
      path: `${__dirname}/.env`,
      debug: node_env === "development",
   },
};

export default environment;
