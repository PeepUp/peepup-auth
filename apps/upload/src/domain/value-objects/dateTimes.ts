export class DateTime {
   constructor(private readonly timestamp: number) {}

   getTimestamp(): number {
      return this.timestamp;
   }

   toString(): string {
      return new Date(this.timestamp).toString();
   }

   toISO(): string {
      return new Date(this.timestamp).toISOString();
   }

   getStringDate(): string {
      return new Date(this.timestamp).toDateString();
   }

   getStringTime(): string {
      return new Date(this.timestamp).toTimeString();
   }

   toJSONLocalTime(): string {
      return new Date(this.timestamp).toJSON();
   }

   toLocalString(): string {
      return new Date(this.timestamp).toLocaleString();
   }

   toLocalDateString(): string {
      return new Date(this.timestamp).toLocaleDateString();
   }

   toLocalTimeString(): string {
      return new Date(this.timestamp).toLocaleTimeString();
   }

   /*
    *  Support Format:
    *
    *  */
   toFormat(
      locale?: Intl.LocalesArgument,
      options?: Intl.DateTimeFormatOptions
   ): string {
      return new Date(this.timestamp).toLocaleString(locale, options);
   }
}
