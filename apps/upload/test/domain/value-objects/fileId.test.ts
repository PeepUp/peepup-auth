import { ObjectId } from "mongodb";
import {
   NoSqlFileId,
   SqlFileId,
} from "../../../src/domain/value-objects/fileId";
import { v4 as uuid } from "uuid";

describe("SQL FileId", () => {
   describe("New FileId", () => {
      test("should create unique identifiers SqlFileId with uuid v4", () => {
         const setId = uuid();
         const _id = new SqlFileId(setId);
         expect(_id.value).toEqual(setId);
         expect(_id.value).toBe(setId);
         expect(_id).toBeDefined();
      });
   });

   describe("New FileId without argument", () => {
      test("should create unique identifiers as default value is uuid v4", () => {
         const _id = new SqlFileId();
         expect(_id).toBeDefined();
         expect(_id.value).toBeDefined();
         expect(_id.value).toHaveLength(36);
      });
   });
});

describe("NOSQL FileId", () => {
   describe("New FileId", () => {
      test("should create unique identifiers NoSqlFileId with ObjectId", () => {
         const setId = new ObjectId();
         const _id = new NoSqlFileId(setId.toHexString());
         expect(_id.value).toEqual(setId);
         expect(_id.value.equals(setId)).toBe(true);
         expect(_id).toBeDefined();
      });
   });

   describe("New FileId without argument", () => {
      test("should create unique identifiers as default value is ObjectId", () => {
         const _id = new NoSqlFileId();
         expect(_id).toBeDefined();
         expect(_id.value.equals(_id.value)).toBe(true);
         expect(_id.value).toBeDefined();
      });
   });
});
