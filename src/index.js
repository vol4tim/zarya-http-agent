import express from "express";
import cors from "cors";
import createServer from "./server";
import passportRouter from "./routes/passport";
import logger from "./services/logger";
import robonomics from "./services/robonomics";
import config from "../config.json";

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());
app.use("/api/passport", passportRouter);

app.get("/", function (req, res) {
  res.send("main");
});

server.listen(config.PORT, config.HOST, () => {
  logger.info("Web listening " + config.HOST + " on port " + config.PORT);
  robonomics.ready().then(() => {
    logger.info("robonomics ready");
    robonomics.onDemand(config.DEMAND.model, (demand) => {
      if (config.DEBUG) {
        logger.info(`demand ${JSON.stringify(demand.toObject())}`);
      }
    });
  });
});
