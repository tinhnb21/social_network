import "dotenv/config";
import { IndexRoute } from "@modules/index";
import App from "./app";
import { validateEnv } from "@core/utils";
import UserRoute from "@modules/users/users.route";
import AuthRoute from "@modules/auth/auth.route";
import { ProfileRoute } from "@modules/profile";
import PostRoute from "@modules/posts/posts.route";

validateEnv();
const routes = [
  new IndexRoute(),
  new UserRoute(),
  new AuthRoute(),
  new ProfileRoute(),
  new PostRoute(),
];
const app = new App(routes);
app.listen();
