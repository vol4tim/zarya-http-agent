import IPFS from "ipfs-api";
import config from "../../config.json";

const ipfs = new IPFS(config.IPFS_PROVIDER);

export default ipfs;
