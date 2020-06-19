import IPFS from "ipfs-api";
import axios from "axios";
import moment from "moment";
import fs from "fs";
import path from "path";
import config from "../../config.json";

function login(username, password) {
  return axios
    .post("https://api.temporal.cloud/v2/auth/login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.expire) {
        fs.writeFileSync(
          path.join(__dirname, "/../../files/session.json"),
          JSON.stringify(response.data)
        );
        return response.data.token.toString();
      }
      throw new Error("not token");
    });
}

let ipfs = null;

export default function () {
  if (ipfs) {
    return ipfs;
  }
  throw new Error("not init ipfs");
}

export function check() {
  if (
    config.IPFS_PROVIDER_AUTH &&
    config.IPFS_PROVIDER_AUTH.username &&
    config.IPFS_PROVIDER_AUTH.password
  ) {
    let session;
    try {
      session = JSON.parse(
        fs.readFileSync(path.join(__dirname, "/../../files/session.json"))
      );
    } catch {
      return false;
    }
    if (
      session &&
      session.expire &&
      moment(session.expire).diff(moment()) <= 0
    ) {
      return false;
    }
  }
  return true;
}

export function initIpfs() {
  if (
    config.IPFS_PROVIDER_AUTH &&
    config.IPFS_PROVIDER_AUTH.username &&
    config.IPFS_PROVIDER_AUTH.password
  ) {
    return login(
      config.IPFS_PROVIDER_AUTH.username,
      config.IPFS_PROVIDER_AUTH.password
    ).then((token) => {
      ipfs = new IPFS({
        ...config.IPFS_PROVIDER,
        headers: { authorization: "Bearer " + token },
      });
      return ipfs;
    });
  }
  ipfs = new IPFS({
    ...config.IPFS_PROVIDER,
  });
  return Promise.resolve(ipfs);
}
