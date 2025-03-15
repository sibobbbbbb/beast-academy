import type { FormData, FormErrors } from '@/types/MemberForm'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
