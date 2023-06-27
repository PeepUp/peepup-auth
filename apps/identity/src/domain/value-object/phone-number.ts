import { parsePhoneNumberFromString, PhoneNumber } from "libphonenumber-js";

import type { CountryCode } from "libphonenumber-js";

class PhoneNumberValidator {
   public static validatePhoneNumber(
      phoneNumberString: string,
      defaultCountry: CountryCode = "ID"
   ): PhoneNumber {
      const phoneNumber = parsePhoneNumberFromString(phoneNumberString, defaultCountry);
      if (phoneNumber && phoneNumber.isValid()) {
         return phoneNumber;
      }

      throw new Error("Invalid phone number");
   }
}

export default PhoneNumberValidator;
