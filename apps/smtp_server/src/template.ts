export const mailTemplate = ({ user, otp }: { user: string; otp: number[] | string[] }) =>
    `<body style="margin: 0; padding: 0; font-family: 'Montserrat', sans-serif">
        <div style="max-width: 602px; margin-inline: auto; padding: 26px;" >
            <header>
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td align="left">
                            <div style="height: 10px; display: inline-block;">
                                <img
                                    src="https://res.cloudinary.com/solacely/image/upload/v1684508895/Logo_1_hizrym.png"
                                    alt="solacely logo"
                                    />
                            </div>
                        </td>
                        <td align="right">
                            <table cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="left" style="padding-right: 10px;">
                                        <a href="https://twitter.com/trysolacely">
                                        <img
                                            src="https://res.cloudinary.com/solacely/image/upload/v1694932998/Social_icon_-_Twitter_cts1ui.png"
                                            alt="solacely twitter"
                                            width="20px"
                                            height="20px"
                                            />
                                        </a>
                                    </td>
                                    <td align="left" style="padding-right: 10px;">
                                        <a href="#">
                                        <img
                                            src="https://res.cloudinary.com/solacely/image/upload/v1694933203/Social_icon_-_FB_m9tazs.png"
                                            alt="solacely facebook"
                                            width="20px"
                                            height="20px"
                                            />
                                        </a>
                                    </td>
                                    <td align="left">
                                        <a href="https://www.instagram.com/solacelyar/">
                                        <img
                                            src="https://res.cloudinary.com/solacely/image/upload/v1694933201/Social_icon_-_IG_ejc1nj.png"
                                            alt="solacely instagram"
                                            width="20px"
                                            height="20px"
                                            />
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </header>
            <main style="width: 100%; padding: 0">
                <h3 style="display: block; margin-top: 60px; font-size: 26px"> Hello, ${user} <br /> </h3>
                <p style="line-height: 25px; color: #515151">
                    <b>Welcome to PeepUp!</b> We're thrilled to have you join our community. As part of our commitment
                    to security, we will be sending you an <b> OTP (One-Time Password) code </b> to your email address 
                    for verification purposes. Please follow the instructions in the email to enter the code and
                    confirm your account. Once verified, you'll be able to start using PeepUp and all its 
                    features.
                </p>
                <div style=" display: flex; align-items: center; justify-content: start; max-width: 100% " >
                    <div style=" font-size: 1.5rem; font-family: Arial; font-weight: 700; text-align: center; width: 13%; padding: 6px 17px 6px 17px; background: #fafbfc; border-radius: 8px; border: 0.5px #1c1c1c solid; margin-right: 5px; " > ${otp[0]} </div>
                    <div style=" font-size: 1.5rem; font-family: Arial; font-weight: 700; text-align: center; width: 13%; padding: 6px 17px 6px 17px; background: #fafbfc; border-radius: 8px; border: 0.5px #1c1c1c solid; margin-right: 5px; " > ${otp[1]} </div>
                    <div style=" font-size: 1.5rem; font-family: Arial; font-weight: 700; text-align: center; width: 13%; padding: 6px 17px 6px 17px; background: #fafbfc; border-radius: 8px; border: 0.5px #1c1c1c solid; margin-right: 5px; " > ${otp[2]} </div>
                    <div style=" font-size: 1.5rem; font-family: Arial; font-weight: 700; text-align: center; width: 13%; padding: 6px 17px 6px 17px; background: #fafbfc; border-radius: 8px; border: 0.5px #1c1c1c solid; margin-right: 5px; " > ${otp[3]} </div>
                    <div style=" font-size: 1.5rem; font-family: Arial; font-weight: 700; text-align: center; width: 13%; padding: 6px 17px 6px 17px; background: #fafbfc; border-radius: 8px; border: 0.5px #1c1c1c solid; margin-right: 5px; " > ${otp[4]} </div>
                    <div style=" font-size: 1.5rem; font-family: Arial; font-weight: 700; text-align: center; width: 13%; padding: 6px 17px 6px 17px; background: #fafbfc; border-radius: 8px; border: 0.5px #1c1c1c solid; margin-right: 5px; " > ${otp[5]} </div>
                </div>
                <p style="color: #515151; line-height: 25px">
                    If this was not you, kindly ignore this message. This code will only
                    be valid for 10 minutes.
                </p>
                <p style="color: #515151; line-height: 25px">
                    Do not share this OTP with anyone. Solacely takes the security of your
                    account very seriously. Solacely Customer Support will never request
                    your Solacely password, OTP, credit card number, or banking account
                    information. Do not click on any links in questionable emails that ask
                    you to change your account information; instead, report this email to
                    Solacely so that it may be looked into.
                </p>
            </main>
            <footer>
                <h3 style="margin-bottom: 2px; margin-top: 12px;"> With 💖 from <span style="color: #252525">PeepUp</span> </h3>
                <p style="color: #515151; line-height: 25px">
                    Questions or faq? Contact us at
                    <span style="color: #1c1c1c">faq@peepup.com</span>. If you'd rather
                    not receive this kind of email, Don't want any more mails from
                    PeepUp? <span style="color: #1c1c1c">Unsubscribe.</span>
                </p>
                <p style="display: block; color: #515151"> © 2022 PeepUp. All rights reserved </p>
            </footer>
        </div>
    </body>`;
