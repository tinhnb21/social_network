import "dotenv/config";
import { IndexRoute } from "@modules/index";
import App from "./app";
import { validateEnv } from "@core/utils";
import UserRoute from "@modules/users/users.route";

validateEnv();
const routes = [new IndexRoute(), new UserRoute()];
const app = new App(routes);
app.listen();
