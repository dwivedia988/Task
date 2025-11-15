import express from "express";
import * as TaskController from "../controller/task.controller.js";

var router = express.Router();

router.post("/", TaskController.save);
router.get("/", TaskController.fetch);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.deletetask);

export default router;
