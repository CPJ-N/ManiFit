import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export const getImageUrl = async (bucketName: string, imageName: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, `${bucketName}/${imageName}`);
    return await getDownloadURL(storageRef);
  };