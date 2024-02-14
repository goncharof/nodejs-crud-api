import "dotenv/config";
import { server } from "./server";

const port = Number(process.env.PORT) || 3000;

server().listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
