import http from "http";
import { handle } from "./routes/user-routes";

const port = 3000;

const server = http.createServer(async (req, res) => {
  try {
    const data = await handle(req);

    console.log(data, "data");

    res.writeHead(data.status);
    res.end(data.body);
  } catch (error) {
    res.writeHead(error.status);
    res.end(error.message);
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
