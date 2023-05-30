import { v4 as uuid } from "uuid";
import { ObjectId } from "mongodb";

export class SqlFileId {
   private readonly _value: string;

   constructor(value?: string) {
      this._value = value || uuid();
   }

   public get value(): string {
      return this._value;
   }

   public equals(id: SqlFileId): boolean {
      return id instanceof SqlFileId && id.value === this.value;
   }
}

export class NoSqlFileId {
   private readonly _value: ObjectId;

   constructor(value?: string) {
      this._value = value ? new ObjectId(value) : new ObjectId();
   }

   public get value(): ObjectId {
      return this._value;
   }

   public stringValue(): string {
      return this._value.toString();
   }

   public equals(id: NoSqlFileId): boolean {
      return id instanceof NoSqlFileId && id.value.equals(this.value);
   }
}
