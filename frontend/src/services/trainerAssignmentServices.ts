const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const assignTrainer = async (trainerId: number, memberIds: number[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trainer/assign`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trainerId, memberIds }),
    });

    if (!response.ok) throw new Error("Failed to assign trainer");
    return await response.json();
  } catch (error) {
    console.error("Error assigning trainer:", error);
    throw error;
  }
};

export const removeStudents = async (trainerId: number, memberIds: number[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trainer/remove`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trainerId, memberIds }),
    });

    if (!response.ok) throw new Error("Failed to remove students");
    return await response.json();
  } catch (error) {
    console.error("Error removing students:", error);
    throw error;
  }
};

export const getStudents = async (trainerId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trainer/students/${trainerId}`, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error("Failed to fetch students");
    return await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};
