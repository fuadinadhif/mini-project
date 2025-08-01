import "dotenv/config.js";
import { App } from "./app.js";

const PORT: string = process.env.PORT || "8000";
const server = new App();

server.listen(PORT);
