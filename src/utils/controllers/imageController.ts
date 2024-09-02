import { ref, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { firebaseBucketName } from "../../constants/firebaseContant";

export const uploadImage = async (imageUri: string) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `${firebaseBucketName.userImages}/${Date.now()}.jpg`); // Generates a unique name for each image

  try {
    const results = await uploadBytes(storageRef, blob);
    console.log('Uploaded a blob or file!', results);
    return results;
  } catch (error) {
    console.error("Upload failed", error);
    return null;
  }
};

export const getImageUrl = async (bucketName: string, imageName: string) => {
  const storageRef = ref(storage, `${bucketName}/${imageName}`);
  return await getDownloadURL(storageRef);
};

export const deleteImage = async (bucketName: string, imageName: string) => {
  const storageRef = ref(storage, `${bucketName}/${imageName}`);
  return await deleteObject(storageRef);
};