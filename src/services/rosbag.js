import { open } from "rosbag";
import Bag, { Time, messages } from "rosbag-write";
import getIpfs from "./ipfs";

export function read(data, cb, options = {}) {
  return open(data).then((bag) => {
    return bag.readMessages(options, (result) => {
      cb(result);
    });
  });
}
/*
ipfs.cat("QmWskhuGX1rpPycsiRfb23XpbLwGmUjSkGm6c5RvS2g9of", (e, r) => {
  const tmpobj = tmp.fileSync();
  fs.writeFileSync(tmpobj.name, r);
  f(tmpobj.name, (t) => {
    console.log(t);
  }).then(() => {
    tmpobj.removeCallback();
  });
});
*/

async function getRosbag(data) {
  const bag = new Bag();
  await messages.init();
  const Message = await messages.getMessage("std_msgs/String");
  const time = Time.fromSecs(1.1);
  Object.keys(data).forEach((topic) => {
    if (typeof data[topic] === "number" || typeof data[topic] === "string") {
      bag.write("/" + topic, new Message({ data: data[topic] }), time);
      time.nsec += 100000000;
    } /* else {
      data[topic].forEach((item) => {
        bag.write("/" + topic, new Message({ data: item }), time);
        time.nsec += 100000000;
      });
    }*/
  });
  bag.close();
  return bag.file.getBuffer();
}

export async function getObjectiveByData(data) {
  const buf = await getRosbag(data);
  const ipfs = getIpfs();
  const res = await ipfs.add(buf);
  return res[0].hash;
}
