// UseUploadImage.ts
import { pickImage } from "./imagePicker";
import { uploadImage } from "../controllers/imageController";

export const useUploadImage = async () => {
  const imageUri = await pickImage();
  if (imageUri) {
    return await uploadImage(imageUri);
  } else {
    console.log("No image picked");
  }
  return null
};