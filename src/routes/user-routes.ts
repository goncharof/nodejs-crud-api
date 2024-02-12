import { IncomingMessage } from "node:http";
import { list, create } from "../controllers/user-controller";
export const handle = async (
  req: IncomingMessage,
): Promise<{ body: string; status: number }> => {
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
        console.log("id", id);
        resolve({
          body: "id: " + id,
          status: 200,
        });

        //   switch (method) {
        //     case "GET": // Read a single item
        //       if (itemIndex > -1) {
        //         sendJSON(items[itemIndex]);
        //       } else {
        //         sendJSON({ error: "Item not found" }, 404);
        //       }
        //       break;
        //     case "PUT": // Update an existing item
        //       let body = "";
        //       req.on("data", (chunk) => {
        //         body += chunk.toString();
        //       });
        //       req.on("end", () => {
        //         if (itemIndex > -1) {
        //           const updatedItem = JSON.parse(body);
        //           items[itemIndex] = { ...items[itemIndex], ...updatedItem };
        //           sendJSON(items[itemIndex]);
        //         } else {
        //           sendJSON({ error: "Item not found" }, 404);
        //         }
        //       });
        //       break;
        //     case "DELETE": // Delete an item
        //       if (itemIndex > -1) {
        //         items.splice(itemIndex, 1);
        //         sendJSON({ message: "Item deleted" });
        //       } else {
        //         sendJSON({ error: "Item not found" }, 404);
        //       }
        //       break;
        //     default:
        //       res.writeHead(405);
        //       res.end(`Method ${method} not allowed`);
        //   }
      } else {
        resolve({
          body: "Not found",
          status: 404,
        });
      }
    } catch {
      reject({ message: "Internal server error", status: 500 });
    }
  });
};
