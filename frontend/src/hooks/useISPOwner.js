import { useSelector } from 'react-redux'

export const useISPOwner = () => {
  const { ispOwnerId, userData, role } = useSelector(s => s.auth)
  const isOwner = role === 'ispOwner'
  return { ispOwnerId, ispOwnerData: userData, isOwner }
}
