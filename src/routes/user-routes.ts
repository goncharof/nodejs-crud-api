import { IncomingMessage } from "node:http";
import {
  list,
  create,
  update,
  getById,
  remove,
} from "../controllers/user-controller";
export const handle = async (
  req: IncomingMessage,
): Promise<{ body?: string; status: number }> => {
  const url = req.url.replace(/^\/+|\/+$/g, "");
  console.log("req", url);

  return new Promise(async (resolve, reject) => {
    try {
      if ("api/users" === url) {
        switch (req.method) {
          case "GET":
            resolve(list());
            break;
          case "POST":
            resolve(await create(req));
            break;
          default:
            resolve({
              body: `Method ${req.method} not allowed`,
              status: 404,
            });
        }
      } else if (/^api\/users\/([^\/]+)$/.test(url)) {
        const [, , id] = url.split("/");

        switch (req.method) {
          case "GET":
            resolve(getById(id));
            break;
          case "PUT":
            resolve(await update(id, req));
            break;
          case "DELETE":
            resolve(remove(id));
            break;
          default:
            resolve({
              body: `Method ${req.method} not allowed`,
              status: 404,
            });
        }
      } else {
        resolve({
          body: JSON.stringify({ error: "Not found" }),
          status: 404,
        });
      }
    } catch {
      reject({ message: "Internal server error", status: 500 });
    }
  });
};
