import express from "express";
import type { Request, Response } from "express";

const app = express();
// const port = 4335;

app.get("/", (req: Request, res: Response) => {
    console.log(req.hostname);
    res.send("Hello World!");
});
