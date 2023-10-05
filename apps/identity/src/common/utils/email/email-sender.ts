class EmailSender {
    private static instance: EmailSender;

    private emailApi: EmailApi | undefined;

    private status = false;

    static getInstance(): EmailSender {
        if (!this.instance) this.instance = new EmailSender();
        return new EmailSender();
    }

    static resetInstance(): void {
        this.instance = new EmailSender();
    }

    getStatus(): boolean {
        return this.status;
    }

    activate() {
        this.status = true;
    }

    deactivate() {
        this.status = false;
    }

    setEmailApi(emailApi: EmailApi): void {
        this.emailApi = emailApi;
    }

    async sendEmail(data: SendEmailVerificationArgs): Promise<SendEmailResponse> {
        this.validateEmailSender();
        return this.emailApi!.sendEmail(data);
    }

    private validateEmailSender(): void {
        if (!this.status) throw new Error("EmailSender is not active");
        if (!this.emailApi) throw new Error("EmailApi is not set");
    }
}

export interface EmailApi {
    sendEmail(data: SendEmailVerificationArgs): Promise<SendEmailResponse>;
}

export type SendEmailResponse = {
    toEmail: string;
    status: "success" | "error";
};

export type SendEmailVerificationArgs = {
    toEmail: string;
    verificationToken: string;
};

export type SendEmailArgs = {
    toEmail: string;
    subject: string;
    textBody: string;
    htmlBody: string;
};

export default EmailSender;
