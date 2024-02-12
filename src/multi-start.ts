import { createServer } from "node:http";
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import { Server, request } from "node:http";
import { server } from "./server";

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

  const workersPorts = [...Array(aP - 1)].map((_, i) => portMaster + i + 1);
  let currentworkersPortsIndex = 0;
  function getNextPort() {
    const url = workersPorts[currentworkersPortsIndex];
    currentworkersPortsIndex =
      (currentworkersPortsIndex + 1) % workersPorts.length;
    return url;
  }

  const balancer = createServer((req, res) => {
    const options = {
      hostname: "http://localhost",
      port: getNextPort(),
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    console.log(options);

    const proxyReq = request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on("error", () => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      // res.end({ error: err.message });
    });

    req.pipe(proxyReq, { end: true });
  });
  balancer.listen(portMaster);
} else {
  const app: Server = server();

  app.listen(Number(process.env.PORT), () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
}
