import { Request, Response} from "express"
import { listMeasures } from "../services/measureService"

export const listMeasureController = async (req: Request, res: Response) => {
  try {
    const customerCode = req.params.customerCode
    const measureType =  req.query.measure_type ? req.query.measure_type.toString() : ""

    const result = await listMeasures(customerCode, measureType)

    if(result.statusCode !== 200) {
      return res.status(result.statusCode).json(result.error);
    }

    return res.status(200).json(result);
  } catch(error) {
    return res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "An unexpected error occurred."
    });
  }
}