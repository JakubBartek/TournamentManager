import { ProfileDto } from '../auth/auth.dto'

export const userMapper = (user: ProfileDto) => {
  return {
    email: user.email,
    role: user.role,
  }
}
