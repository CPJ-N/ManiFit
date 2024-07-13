// uploadImage.ts
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

export const uploadImage = async (imageUri: string): Promise<void> => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `images/${Date.now()}.jpg`); // Generates a unique name for each image

  try {
    await uploadBytes(storageRef, blob);
    console.log('Uploaded a blob or file!');
  } catch (error) {
    console.error("Upload failed", error);
  }
};