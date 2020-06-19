import { getObjectiveByData } from "./rosbag";
import getRobonomics from "./robonomics";
import config from "../../config.json";
import logger from "./logger";

const list = {};

function getDeadline(web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock("latest", (e, r) => {
      if (e) {
        return reject(e);
      }
      resolve(r.number);
    });
  });
}

export function getOrder(hash) {
  if (Object.prototype.hasOwnProperty.call(list, hash)) {
    return list[hash];
  }
  return false;
}

export async function send(data, cb) {
  try {
    const robonomics = getRobonomics();

    const deadline = await getDeadline(robonomics.web3);
    const objective = await getObjectiveByData(data);

    const msg = {
      ...config.DEMAND,
      objective: objective,
      lighthouse: robonomics.lighthouse.address,
      deadline: deadline + 1000,
    };

    let offerListener = null;
    let resultListener = null;
    let demand = null;

    offerListener = robonomics.onOffer(msg.model, (offer) => {
      if (config.DEBUG) {
        logger.info(`offer ${JSON.stringify(offer.toObject())}`);
      }
      if (
        demand !== null &&
        Object.prototype.hasOwnProperty.call(demand, "signature") &&
        offer.objective === msg.objective &&
        offer.token === msg.token &&
        Number(offer.cost) === Number(msg.cost)
      ) {
        list[demand.signature].offer = offer.toObject();
        robonomics.messenger.off(offerListener);
        offerListener = null;
      }
    });

    resultListener = robonomics.onResult((report) => {
      if (config.DEBUG) {
        logger.info(`report ${JSON.stringify(report.toObject())}`);
      }
      if (
        demand !== null &&
        Object.prototype.hasOwnProperty.call(demand, "signature") &&
        list[demand.signature].liability !== null &&
        report.liability === list[demand.signature].liability
      ) {
        list[demand.signature].report = report.toObject();
        robonomics.messenger.off(resultListener);
        resultListener = null;
      }
    });

    robonomics
      .sendDemand(msg, true, (r) => {
        demand = r;

        list[demand.signature] = {
          demand: demand.toObject(),
          offer: null,
          report: null,
          result: null,
          liability: null,
        };

        cb(null, list[demand.signature].demand);
      })
      .then((liability) => {
        if (config.DEBUG) {
          logger.info(`liability ${liability.address}`);
        }
        list[demand.signature].liability = liability.address;
        if (offerListener) {
          robonomics.messenger.off(offerListener);
          offerListener = null;
        }
        return liability.onResult();
      })
      .then((result) => {
        if (config.DEBUG) {
          logger.info(`result ${JSON.stringify(result)}`);
        }
        if (resultListener) {
          robonomics.messenger.off(resultListener);
          resultListener = null;
        }
        list[demand.signature].result = result;
      });
  } catch (error) {
    logger.error(error);
    cb(error);
  }
}
