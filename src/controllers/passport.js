import { send, getOrder } from "../services/order";
import { check } from "../services/ipfs";
import { runRobonomics } from "../services/robonomics";
import logger from "../services/logger";

export default {
  async create(req, res) {
    if (!check()) {
      await runRobonomics();
      logger.info("robonomics reinit ready");
    }

    const data = {
      cylinder_agent_container: req.body.cylinder.agent_container,
      cylinder_serial_number: req.body.cylinder.serial_number,
      cylinder_nano_protection: req.body.cylinder.nano_protection,
      cylinder_test_start_test_date: req.body.cylinder.test.start_test_date,
      cylinder_test_start_test_pressure:
        req.body.cylinder.test.start_test_pressure,
      cylinder_test_end_test_date: req.body.cylinder.test.end_test_date,
      cylinder_test_end_test_pressure: req.body.cylinder.test.end_test_pressure,
      cylinder_test_total_test_time: req.body.cylinder.test.total_test_time,
      cylinder_production_date: req.body.cylinder.production_date,
      cylinder_next_date_inspection: req.body.cylinder.next_date_inspection,
      cylinder_file: req.body.cylinder.file,
      valve_serial_number: req.body.valve.serial_number,
      valve_test_start_test_date: req.body.valve.test.start_test_date,
      valve_test_start_test_pressure: req.body.valve.test.start_test_pressure,
      valve_test_end_test_date: req.body.valve.test.end_test_date,
      valve_test_end_test_pressure: req.body.valve.test.end_test_pressure,
      valve_test_total_test_time: req.body.valve.test.total_test_time,
      valve_production_date: req.body.valve.production_date,
      pressure_gauge_serial_number: req.body.pressure_gauge.serial_number,
      pressure_gauge_date_inspection: req.body.pressure_gauge.date_inspection,
      module_serial_number: req.body.module.serial_number,
      module_test_start_test_date: req.body.module.test.start_test_date,
      module_test_start_test_pressure: req.body.module.test.start_test_pressure,
      module_test_end_test_date: req.body.module.test.end_test_date,
      module_test_end_test_pressure: req.body.module.test.end_test_pressure,
      module_test_total_test_time: req.body.module.test.total_test_time,
      module_empty_weight: req.body.module.empty_weight,
      module_file: req.body.module.file,
      filling_сlean_аgent: req.body.filling.сlean_аgent,
      filling_clean_agent_weight: req.body.filling.clean_agent_weight,
      filling_date: req.body.filling.filling_date,
      filling_total_weight: req.body.filling.total_weight,
      filling_file: req.body.filling.file,
      url_manufacture: req.body.URL_manufacture,
    };

    send(data, (e, r) => {
      if (e) {
        return res.send({
          error: e.message,
        });
      }
      return res.send({
        order: r.signature,
      });
    });
  },
  order(req, res) {
    const hash = req.params.hash;
    const order = getOrder(hash);
    if (order) {
      return res.send({
        order,
      });
    }
    return res.send({
      error: "order not found",
    });
  },
};
