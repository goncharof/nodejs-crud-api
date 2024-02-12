import { createServer } from "node:http";
import { handle } from "./routes/user-routes";

export const server = () => {
  const server = createServer(async (req, res) => {
    try {
      const data = await handle(req);
      res.writeHead(data.status, { "Content-Type": "application/json" });
      res.end(data.body);
    } catch (error) {
      res.writeHead(error.status);
      res.end(error.message);
    }
  });

  return server;
};
