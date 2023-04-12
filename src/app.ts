import { Route } from "@core/interfaces";
import express from "express";
import mongoose from "mongoose";
import hpp from "hpp";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { Logger } from "@core/utils";
import { errorMiddleware } from "@core/middleware";

class App {
  public app: express.Application;
  public port: string | number;
  public production: boolean;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.production = process.env.NODE_ENV == "production" ? true : false;

    this.connectToDatabase();
    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.initializeErrorMiddleware();
  }

  public listen() {
    this.app.listen(this.port, () => {
      Logger.info(`Server is listening on port ${this.port}`);
    });
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  //bảo mật middleware
  private initializeMiddleware() {
    if (this.production) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(morgan("combined")); //log
      this.app.use(cors({ origin: "domain", credentials: true }));
    } else {
      this.app.use(morgan("dev")); //log
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeErrorMiddleware() {
    this.app.use(errorMiddleware);
  }

  private connectToDatabase() {
    // const connectString = process.env.MONGODB_URI;
    // if (!connectString) {
    //   Logger.error("Connection string is invalid");
    //   return;
    // }

    mongoose
      .connect("mongodb://localhost:27017/social_network", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => Logger.info("Database connected.."))
      .catch((reason: any) => {
        Logger.error(reason);
      });
  }
}

export default App;
