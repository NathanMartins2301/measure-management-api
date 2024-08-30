import { Router } from "express";
import { uploadMeasureController } from "../controllers/measureController";
import { confirmMeasureController } from "../controllers/confirmMeasureController";
import { listMeasureController } from "../controllers/listMeasureController";

const router = Router()

router.post('/upload', uploadMeasureController)
router.patch('/confirm', confirmMeasureController)
router.get('/:customerCode/list', listMeasureController)


export default router