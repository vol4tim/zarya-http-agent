import express from "express";
import controller from "../controllers/passport";

const router = express.Router();

router.post("/", controller.create);
router.get("/order/:hash", controller.order);

export default router;
