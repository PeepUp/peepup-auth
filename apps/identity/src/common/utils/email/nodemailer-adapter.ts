import Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";
import NodemailerSmtpServer from "./smtp-server";
import { EmailApi, SendEmailResponse, SendEmailVerificationArgs } from "./email-sender";

class NodeMailerAdapter implements EmailApi {
    private transporter: Mail;

    constructor() {
        this.transporter = nodemailer.createTransport(
            new NodemailerSmtpServer().getConfig()
        );
    }

    /* eslint-disable class-methods-use-this */
    buildEmailVerificationLink(token: string): string {
        return `http://localhost:4334/identities/email/verify?vt=${token}`;
    }

    /* eslint-disable class-methods-use-this */
    buildEmailTextBody(content: string): string {
        return `Verify your email address by clicking this link: ${content}`;
    }

    /* eslint-disable class-methods-use-this */
    buildEmailHtmlBody(content: string): string {
        return ` <h1>Welcome to Unsocial</h1> <br/> Welcome to DoFavour, the coolest social media platform! <br/> <br/> Please click on the link below (or copy it to your browser) to verify your email address: <br/> <br/> <a href="${content}">${content}</a>`;
    }

    async sendEmail(data: SendEmailVerificationArgs): Promise<SendEmailResponse> {
        const { toEmail, verificationToken } = data;

        const emailVerificationLink = this.buildEmailVerificationLink(verificationToken);
        const subject = "Welcome to DoFavour! Please verify your email address!";
        const textBody = this.buildEmailTextBody(emailVerificationLink);
        const htmlBody = this.buildEmailHtmlBody(emailVerificationLink);

        await this.transporter.sendMail({
            from: "DoFavour Service<noreply@dofavour.com>",
            to: toEmail,
            subject,
            text: textBody,
            html: htmlBody,
        });

        return {
            toEmail,
            status: "success",
        };
    }
}

export default NodeMailerAdapter;
