import { createServer } from "node:http";
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import { Server } from "http";
import { server } from "./server"; // Assuming server export

const aP = availableParallelism();
const portMaster = 4000;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < aP - 1; i++) {
    cluster.fork({ PORT: portMaster + i + 1 });
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

  const balancer = createServer(() => {});
  balancer.listen(portMaster);
} else {
  const app: Server = server();

  app.listen(Number(process.env.PORT), () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
}
