import { PrismaClient } from "@prisma/client";
import { analyzeImage } from "../lib/aiAnalysisService";
import { randomUUID } from "node:crypto"

interface MeasureInterface {
  measure_uuid: string;       
  customer_code: string;      
  measure_datetime: Date;     
  measure_type: 'WATER' | 'GAS';  
  image_url: string;          
  measure_value: number;      
  has_confirmed: boolean;     
}

const prisma = new PrismaClient()

export const createMeasure = async (data: MeasureInterface) => {
  const { customer_code, measure_type, image_url, measure_datetime} = data
  const parsedMeasureDatetime = new Date(measure_datetime)
  const guid = randomUUID()

  const startOfMonth = new Date(parsedMeasureDatetime.getFullYear(),parsedMeasureDatetime.getMonth(), 1);
  const endOfMonth = new Date(parsedMeasureDatetime.getFullYear(), parsedMeasureDatetime.getMonth() + 1, 0);

    const existingMeasure = await prisma.reading.findFirst({
      where: {
        customer_code,
        measure_type,
        measure_datetime: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    if(existingMeasure){
      return {
        statusCode: 409,
        error: {
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        }
      }
    }

    const res = await analyzeImage(image_url)

    const dataToCreate = {
        image_url: res.img_url,
        customer_code: data.customer_code,
        measure_datetime: new Date(data.measure_datetime),
        measure_type: data.measure_type,
        measure_value: parseInt(res.value),
        measure_uuid: guid,
        has_confirmed: false
    }

    try {
      await prisma.reading.create({
        data: dataToCreate
      })

      return {
        statusCode: 200,
        data: {
          image_url: dataToCreate.image_url,
          measure_value: dataToCreate.measure_value,
          measure_uuid: dataToCreate.measure_uuid
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: {
          error_code: "DATABASE_ERROR",
        }
      }
    }

    
}

export const confirmMeasure = async(confirm_value: number, measure_uuid: string) => {
  const measure = await prisma.reading.findUnique({
    where: { measure_uuid }
  })


  if(!measure){
    return {
      statusCode: 404,
      error: {
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura do mês já realizada"
      }
    };
  }

  if(measure.has_confirmed){
    return {
      statusCode: 409,
      error: {
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada"
      }
    };
  }

  await prisma.reading.update({
    where: {measure_uuid},
    data: {
      measure_value: confirm_value,
      has_confirmed: true
    }
  })

  return {
    statusCode: 200,
    success: true  
  } 

}

export const listMeasures = async(customerCode:string, measureType:string) => {
  if(measureType && !['WATER', 'GAS'].includes(measureType.toUpperCase())){
    return {
      statusCode: 400,
      error: {
        error_code: "INVALID_TYPE",
        error_description: "TTipo de medição não permitida"
      }
    };
  }

  const measures = await prisma.reading.findMany({
    where: {
      customer_code: customerCode,
      ...(measureType ? { measure_type: measureType.toUpperCase()} : {})
    },
    select:{
      measure_uuid: true,
      measure_datetime: true,
      measure_type: true,
      has_confirmed: true,
      image_url: true,
    }
  })

  if(measures.length === 0){
    return {
      statusCode: 404,
      error: {
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitur encontrada"
      }
    };
  }

  return {
    statusCode: 200,
    customer_code: customerCode,
    measures
  }
}