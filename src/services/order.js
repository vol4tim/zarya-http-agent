import { getObjectiveByData } from "./rosbag";
import robonomics from "./robonomics";
import config from "../../config.json";

const list = {};

function getDeadline() {
  return new Promise((resolve) => {
    robonomics.web3.eth.getBlock("latest", (e, r) => {
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
  const deadline = await getDeadline();
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

      offerListener = robonomics.onOffer(demand.model, (offer) => {
        if (
          offer.objective === demand.objective &&
          offer.token === demand.token &&
          Number(offer.cost) === Number(demand.cost)
        ) {
          list[demand.signature].offer = offer.toObject();
          robonomics.messenger.off(offerListener);
          offerListener = null;
        }
      });

      resultListener = robonomics.onResult((report) => {
        if (
          list[demand.signature].liability !== null &&
          report.liability === list[demand.signature].liability
        ) {
          list[demand.signature].report = report.toObject();
          robonomics.messenger.off(resultListener);
          resultListener = null;
        }
      });

      cb(list[demand.signature].demand);
    })
    .then((liability) => {
      list[demand.signature].liability = liability.address;
      if (offerListener) {
        robonomics.messenger.off(offerListener);
        offerListener = null;
      }
      return liability.onResult();
    })
    .then((result) => {
      if (resultListener) {
        robonomics.messenger.off(resultListener);
        resultListener = null;
      }
      list[demand.signature].result = result;
    });
}
