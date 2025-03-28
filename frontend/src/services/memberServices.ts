const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { FormDataMember, FormErrors } from '@/types/MemberForm'

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
  formData: FormDataMember,
  errors: FormErrors,
  apiError: { value: string | null },
  isSubmitting: { value: boolean },
  formSubmitted: { value: boolean }
) => {
  try {
    const form = new FormData()
    form.append('name', formData.name)
    form.append('email', formData.email)
    if (formData.img_file) {
      form.append('img_file', formData.img_file);
    }
    if (formData.phone) {
      form.append('phone', formData.phone);
    }

    const response = await fetch(`${API_BASE_URL}/add-member`, {
      method: 'POST',
      body: form,
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
      formData.name = ''
      formData.img_file = null
      formData.email = ''
      formData.phone = ''
    }
  } catch (error) {
    apiError.value = 'Network error. Please check your connection and try again.'
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}

export const updateUserData = async (id: number, name: string, phone_no: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-member/${id}`, {
      method: 'PUT',
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

export const getProfileUsers = async () => {
  try {
    const response = await fetch(API_BASE_URL + '/profile', {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Gagal mengambil data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export const updateProfile = async (name: string, img_url: string, phone_no: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone_no, img_url }),
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Gagal mengupdate profile');
    }
    return;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

export const checkPhoneNumber = async (phone_no: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-phone`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_no }),
      credentials: 'include'
    });
    if (response.status >= 500) {
      throw new Error('Gagal mengecek nomor telepon');
    }
    const data = await response.json();
    return data.isUsed;
  } catch (error) {
    console.error('Error checking phone number:', error);
    return null;
  }
}