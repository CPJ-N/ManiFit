
export const isValidImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      return contentType && contentType.startsWith('image/');
    } catch (error) {
      console.log('Error fetching image URL:', error);
      return false;
    }
  };