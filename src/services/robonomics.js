import Web3 from "web3";
import Robonomics, { MessageProviderIpfsApi } from "robonomics-js";
import ipfs from "./ipfs";
import config from "../../config.json";

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(config.WEB3_PROVIDER, {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  })
);

const robonomics = new Robonomics({
  web3: web3,
  messageProvider: new MessageProviderIpfsApi(ipfs),
  ...config.ROBONOMICS,
});

export default robonomics;
