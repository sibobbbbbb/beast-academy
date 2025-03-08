const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getData = async () => {
  try {
    const response = await fetch(API_BASE_URL + '/template-routes');
    if (!response.ok) {
      throw new Error('Gagal mengambil data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
