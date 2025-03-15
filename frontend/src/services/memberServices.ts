const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getMember = async () => {
  try {
    const response = await fetch(API_BASE_URL + '/get-member');
    if (!response.ok) {
      throw new Error('Gagal mengambil data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const deleteMemberById = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-member/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Gagal menghapus member');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting member:', error);
    return null;
  }
};

export const updateUserData = async (id: number, name: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-member/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error('Gagal mengupdate member');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating member:', error);
    return null;
  }
};