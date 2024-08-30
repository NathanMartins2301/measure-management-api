import { Request, Response} from "express"
import { confirmMeasure } from "../services/measureService"

export const confirmMeasureController = async (req: Request, res: Response) => {
  try{
    const { measure_uuid, confirmed_value } = req.body


    if(typeof measure_uuid !== "string" || typeof confirmed_value !== "number"){
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Invalid data type measure_uuid or confirmed_value"
       })
    }
    const result = await confirmMeasure( confirmed_value, measure_uuid)

    if(result.statusCode !== 200){
      return res.status(result.statusCode).json(result.error)
    }
  
    return res.status(200).json({ success: true });

  }catch(error){
    return res.status(500).json({ error_code: "INTERNAL_SERVER_ERROR", error_description: "An unexpected error occurred." });
  }

}