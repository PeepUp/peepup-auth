import CheckViolationException from "./check-violation";
import ForeignKeyViolationException from "./foreignkey-violation";
import NotNullException from "./not-null";
import UniqueViolationException from "./unique-violation";
import UnknownDbError from "./unknown-db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapPgError = (error: any) => {
    if (!error?.code) return new UnknownDbError(error);

    switch (error.code) {
        case "23502": {
            throw new NotNullException(error);
        }
        case "23503": {
            throw new ForeignKeyViolationException(error);
        }
        case "23505": {
            throw new UniqueViolationException(error);
        }
        case "23514": {
            throw new CheckViolationException(error);
        }
        default: {
            throw new UnknownDbError(error);
        }
    }
};

export const mapDbError = mapPgError;
