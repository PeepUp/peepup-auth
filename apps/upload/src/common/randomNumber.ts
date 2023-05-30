import crypto from "crypto";

export async function randomString(len: number): Promise<string> {
   const codePossibleChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";

   const randomIndices = new Uint32Array(len);
   crypto.getRandomValues(randomIndices);

   const result = Array.from(
      randomIndices,
      (index) => codePossibleChars[index % codePossibleChars.length]
   ).join("");

   return result;
}
