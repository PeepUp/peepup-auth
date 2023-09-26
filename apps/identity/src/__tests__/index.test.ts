import server from "../infrastructure/http/app";
import { main } from "..";

const mockServer = {
    ready: jest.fn().mockImplementation(() => Promise.resolve()),
    listen: jest.fn().mockImplementation(() => Promise.resolve()),
    config: {
        environment: {
            port: process.env.PORT || 3000,
            host: process.env.HOST || "0.0.0.0",
        },
    },
    log: {
        error: jest.fn(),
    },
    close: jest.fn().mockImplementation((cb: () => void) => cb()),
};

describe("main", () => {
    it("should start the server", async () => {
        await main();

        expect(server.ready).toHaveBeenCalled();
        expect(server.listen).toHaveBeenCalledWith({
            port: mockServer.config.environment.port,
            host: mockServer.config.environment.host,
        });
        expect(console.log).toHaveBeenCalledWith("🐢 Server listening on localhost:3000");
    });

    it("should handle errors and shut down the server", async () => {
        const mockError = new Error("Some error");
        (server.ready as jest.Mock).mockRejectedValueOnce(mockError); // Mock server.ready to reject with an error

        await main();

        expect(server.close).toHaveBeenCalled();
        expect(server.log.error).toHaveBeenCalledWith("Server has been shut down");
        expect(process.exit).toHaveBeenCalledWith(0);
    });
});
