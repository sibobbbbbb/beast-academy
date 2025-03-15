const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { FormData, FormErrors } from '@/types/MemberForm'

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

export const addNewMember = async (
  form: FormData,
  errors: FormErrors,
  apiError: { value: string | null },
  isSubmitting: { value: boolean },
  formSubmitted: { value: boolean }
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add-member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.errors) {
        data.errors.forEach((err: { param: keyof FormErrors; msg: string }) => {
          errors[err.param] = err.msg
        })
      } else if (data.error) {
        apiError.value = data.error
      } else if (response.status === 409) {
        apiError.value = 'A user with this name, email, or phone number already exists'
      } else {
        apiError.value = 'An unexpected error occurred. Please try again.'
      }
    } else {
      formSubmitted.value = true
      form.name = ''
      form.img_url = ''
      form.email = ''
      form.phone = ''
    }
  } catch (error) {
    apiError.value = 'Network error. Please check your connection and try again.'
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}

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