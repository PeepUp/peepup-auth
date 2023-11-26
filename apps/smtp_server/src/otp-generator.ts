export function generateOTP(length?: number): string[] {
    const possibleChars = "0123456789"; // Replace with your desired characters
    const len = length || 6; // The length of the OTP defaults to 6
    let otp = "";
    for (let i = 0; i < len; i += 1) {
        let randomChar = possibleChars[Math.floor(Math.random() * possibleChars.length)];
        if (otp.includes(randomChar as string)) {
            // If the current character is the same as the previous character, generate a new one
            randomChar = possibleChars[Math.floor(Math.random() * possibleChars.length)];
        }
        otp += randomChar;
    }
    return otp.split("");
}
