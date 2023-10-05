export default class NodemailerSmtpServer {
    private host = process.env.SMTP_HOST!;

    private port = parseInt(process.env.SMTP_PORT!, 10);

    private user = process.env.SMTP_APIKEY_PUBLIC! || "project.1";

    private pass = process.env.SMTP_APIKEY_PRIVATE! || "secret.1";

    getConfig(): SmtpServerConfig {
        return {
            host: this.host,
            port: this.port,
            auth: {
                user: this.user,
                pass: this.pass,
            },
        };
    }
}

export type SmtpServerConfigAuth = {
    user: string;
    pass: string;
};

export type SmtpServerConfig = {
    host: string;
    port: number;
    auth: SmtpServerConfigAuth;
};
