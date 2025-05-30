import api, { API_BASE_URL } from "./axios";

export const updateUserData = async (id: number, name: string, phone_no: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-member/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone_no }),
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

export const getStats = async () => {
    try {
    const response = await fetch(`${API_BASE_URL}/admin-stats`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Gagal mendapatkan stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getching Stats:', error);
    return null;
  }
}

export const getTrainerStats = async (tid : Number) => {
    try {

    console.log("fetching " + `${API_BASE_URL}/trainer-stats/${tid}`);
    const response = await fetch(`${API_BASE_URL}/trainer-stats/${tid}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Gagal mendapatkan stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getching Stats:', error);
    return null;
  }
}