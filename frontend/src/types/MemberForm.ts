export interface FormDataMember {
  name: string
  img_file: File | null
  email: string
  phone?: string
}

export interface FormErrors {
  name?: string
  img_file?: string
  email?: string
  phone?: string
}