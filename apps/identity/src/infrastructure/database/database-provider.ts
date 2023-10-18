abstract class DatabaseProvider {
    private static instance: DatabaseProvider;

    private constructor() {
        console.log("Database instance created!");
    }

    public abstract getInstance(): DatabaseProvider;
}

export default DatabaseProvider;
