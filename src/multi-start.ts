import { createServer } from "node:http";
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import { Server, request } from "node:http";
import { server } from "./server";
import { db } from "./utils/database";

const aP = availableParallelism();
const portMaster = 4000;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  cluster.on("message", (w, users) => {
    db.users = users;
    for (const id in cluster.workers) {
      cluster.workers[id].send(db.users);
    }
  });

  for (let i = 0; i < aP - 1; i++) {
    cluster.fork({ PORT: portMaster + i + 1 });
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

  const workersPorts = [...Array(aP - 1)].map((_, i) => portMaster + i + 1);
  let currentworkersPortsIndex = 0;

  const balancer = createServer((req, res) => {
    console.log(
      `balancer will use port ${workersPorts[currentworkersPortsIndex]}`,
    );

    req
      .pipe(
        request(
          {
            path: req.url,
            port: workersPorts[currentworkersPortsIndex],
            headers: req.headers,
            method: req.method,
          },
          (r) => {
            res.writeHead(r.statusCode, r.headers);
            r.pipe(res);
          },
        ),
      )
      .on("error", () => {
        console.log(
          "balancer failed to connect, try again later, probably worker is not ready",
        );
      });
    currentworkersPortsIndex =
      (currentworkersPortsIndex + 1) % workersPorts.length;
  });

  balancer.listen(portMaster);
} else {
  const app: Server = server();

  app.listen(Number(process.env.PORT), () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });

  app.on("request", (req, res) => {
    res.on("finish", () => {
      process.send(db.users);
    });
  });

  process.on("message", (users: []) => {
    db.users = users;
  });
}
