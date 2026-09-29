export type SignupFormValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export type SigninFormValues = {
  email: string
  password: string
}

export type SignupSuccessResponse = {
  success: boolean
  message: string
  user: {
    id: string
    fullName: string
    email: string
  }
}

export type SigninSuccessResponse = {
  success: boolean
  message: string
  user: {
    id: string
    fullName: string
    email: string
  }
}

export type SignupErrorResponse = {
  success: false
  error: {
    code: string
    message: string
  }
}

export type SigninErrorResponse = {
  success: false
  error: {
    code: string
    message: string
  }
}
