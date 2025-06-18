import RNFS from 'react-native-fs';

const saveImageLocally = async (uri: string, filename: string) => {
  try {
    const destPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    await RNFS.moveFile(uri, destPath);
    console.log('Image saved locally at:', destPath);
    return destPath;
  } catch (error) {
    console.error('Failed to save the image locally', error);
    throw error;
  }
};