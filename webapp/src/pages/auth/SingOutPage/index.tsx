import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../../../components/Loader'
import { getSignInRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

const SignOutPage = () => {
  // This page is used to sign out the user
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils()

  useEffect(() => {
    const handleSignOut = () => {
      trpcUtils.getMe.setData(undefined, { me: null })
      Cookies.remove('token')
      navigate(getSignInRoute(), { replace: true })
    }

    handleSignOut()
  }, [navigate, trpcUtils])

  return <Loader type="page" />
}

export default SignOutPage
