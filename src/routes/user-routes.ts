import { IncomingMessage } from "node:http";
import { list, create } from "../controllers/user-controller";

export const handle = async (
  req: IncomingMessage,
): Promise<{ body: string; status: number }> => {
  console.log("req", req.url);
  return new Promise(async (resolve, reject) => {
    try {
      if (req.method === "GET" && req.url === "/api/users") {
        resolve(list());
      } else if (req.method === "POST" && req.url === "/api/users") {
        resolve(await create(req));
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

  //   create(req, res);
  // }
  // Add other CRUD operations
};

// const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
// const path = parsedUrl.pathname;
// const method = req.method;
// Helper function to send a JSON response
// const sendJSON = (obj, statusCode = 200) => {
//   res.writeHead(statusCode, { "Content-Type": "application/json" });
//   res.end(JSON.stringify(obj));
// };
// // Router logic
// if (path === "/items") {
//   switch (method) {
//     case "GET": // Read all items
//       sendJSON(items);
//       break;
//     case "POST": // Create a new item
//       let body = "";
//       req.on("data", (chunk) => {
//         body += chunk.toString();
//       });
//       req.on("end", () => {
//         const item = JSON.parse(body);
//         item.id = nextId++; // Assign an ID to the item
//         items.push(item);
//         sendJSON(item, 201);
//       });
//       break;
//     default:
//       res.writeHead(405);
//       res.end(`Method ${method} not allowed`);
//   }
// } else if (path.startsWith("/items/") && path.length > "/items/".length) {
//   const id = parseInt(path.slice("/items/".length), 10);
//   const itemIndex = items.findIndex((item) => item.id === id);
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
// } else {
//   res.writeHead(404);
//   res.end("Not Found");
// }
