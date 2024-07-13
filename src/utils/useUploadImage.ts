// UseUploadImage.ts
import { pickImage } from './imagePicker';
import { uploadImage } from './uploadImage';

export const useUploadImage = async () => {
  const imageUri = await pickImage();
  if (imageUri) {
    await uploadImage(imageUri);
  } else {
    console.log("No image picked");
  }
};