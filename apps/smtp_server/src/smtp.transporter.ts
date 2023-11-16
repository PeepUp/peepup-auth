import * as nodemailer from "nodemailer";
import config from "./config";

export const transporter = nodemailer.createTransport({
    ...config,
    auth: {
        type: "oauth2",
        refreshToken: process.env.REFRESH_TOKEN,
        serviceClient: process.env.CLIENT_ID,
        privateKey: process.env.PRIVATE_KEY,
        clientSecret: process.env.CLIENT_SECRET,
        accessToken: process.env.ACCESS_TOKEN,
        accessUrl: process.env.ACCESS_URL,
        clientId: process.env.CLIENT_ID,
        timeout: 3600,
        expires: 1484314697598,
        user: process.env.USER,
    },
});
