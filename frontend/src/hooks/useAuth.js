import { useSelector } from 'react-redux'

export const useAuth = () => {
  const { currentUser, role, userData, ispOwnerId, resellerId, isFetching, accessToken } = useSelector(s => s.auth)
  return {
    currentUser,
    role,
    userData,
    ispOwnerId,
    resellerId,
    isFetching,
    accessToken,
    isAuthenticated: !!currentUser,
  }
}
