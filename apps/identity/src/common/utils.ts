export const utils = {
   type(o: unknown): string {
      if (o === null) {
         return "null";
      }
      if (o === undefined) {
         return "undefined";
      }
      return (
         Object.prototype.toString
            .call(o)
            .match(/\s(\w+)/i)?.[1]
            .toLowerCase() ?? ""
      );
   },
   deepFreeze(o: any): any {
      if (utils.type(o) !== "object") return;
      const props = Object.getOwnPropertyNames(o);
      props.forEach((key: string) => {
         let sub = o[key];
         if (Array.isArray(sub)) Object.freeze(sub);
         if (utils.type(sub) === "object") {
            utils.deepFreeze(sub);
         }
      });
      return Object.freeze(o);
   },
};
