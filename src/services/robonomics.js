import Web3 from "web3";
import Robonomics, { MessageProviderIpfsApi } from "robonomics-js";
import getIpfs, { initIpfs } from "./ipfs";
import logger from "./logger";
import config from "../../config.json";

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(config.WEB3_PROVIDER, {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  })
);

let robonomics = null;

export default function () {
  if (robonomics) {
    return robonomics;
  }
  throw new Error("not init robonomics");
}

export function initRobonomics() {
  const ipfs = getIpfs();
  robonomics = new Robonomics({
    web3: web3,
    messageProvider: new MessageProviderIpfsApi(ipfs),
    ...config.ROBONOMICS,
  });
  return robonomics;
}

export function runRobonomics() {
  if (robonomics) {
    robonomics.messenger.stop();
  }
  return initIpfs()
    .then(initRobonomics)
    .then((robonomics) => {
      return robonomics.ready();
    })
    .then(() => {
      robonomics.onDemand(config.DEMAND.model, (demand) => {
        if (config.DEBUG) {
          logger.info(`demand ${JSON.stringify(demand.toObject())}`);
        }
      });
    });
}
