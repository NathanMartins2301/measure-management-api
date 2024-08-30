import { Request, Response} from "express"
import { createMeasure } from "../services/measureService"
import { isBase64 } from "../utils/validation"
import { analyzeImage } from "../lib/aiAnalysisService"


export const uploadMeasureController = async (req: Request, res: Response) => {
  try{
    const { image, customer_code, measure_datetime, measure_type } = req.body
    
    const isImageBase64 = isBase64(image)
  
    if(!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Missing required fields"
      })
    }
  
    if(!isImageBase64){
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Missing required fields"
      })
    }
  
    const result = await createMeasure(req.body)
    
    if (result.statusCode === 409) {
      return res.status(409).json(result.error);
    }
  
    return res.status(200).json(result.data);
  }catch(error) {
    console.error("Error creating measure:", error);
    return res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "An unexpected error occurred"
    });
  }

}
