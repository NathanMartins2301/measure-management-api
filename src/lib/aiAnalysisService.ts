import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from "path";
import fs from "fs";

const genAi = new GoogleGenerativeAI(process.env.API_KEY_GEMINI as string);
const fileManager = new GoogleAIFileManager(process.env.API_KEY_GEMINI as string);

const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: 'application/json' },
});

const tempDir = path.join(__dirname, '../../temp');

export const analyzeImage = async (base64Image: string) => {

  const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, 'base64');
  
  const imagePath = path.join(tempDir, 'temp_image.jpg');
  
  fs.writeFileSync(imagePath, imageBuffer);
  
  const uploadResponse = await fileManager.uploadFile(imagePath, {
    mimeType: "image/jpeg",
    displayName: "Hidrometro",
  });

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    { text: "return just value of measure in this image" },
  ]);

  const res = {
    value: JSON.parse(result.response.text()),
    img_url: uploadResponse.file.uri,
  };
  
  return res;
};