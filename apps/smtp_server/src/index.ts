import { createTransport } from "nodemailer";
import { mailTemplate } from "./template";
import { generateOTP } from "./otp-generator";

const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT as string, 10),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

const from = {
    name: "jj uu",
    address: "coocoobolo1@gmail.com",
};

const to = {
    name: "xxoo",
    address: "kambingjan31@gmail.com",
};

async function main() {
    await transporter.sendMail({
        from,
        to,
        subject: `Do not reply - OTP for ${to.name}`,
        html: mailTemplate({ user: to.name, otp: generateOTP() }),
    });
}

main();
