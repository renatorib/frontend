import {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Mutation} from 'react-apollo'
import {SIGN_IN_ACCOUNT_KIT} from 'graphql/user/mutations'
import UserInfo from 'components/shared/Auth/AccountKit/UserInfo'
import redirect from 'lib/redirect'
import {getCookie, setCookie} from 'lib/session'
import {signUpUser} from 'lib/auth'

class AccountKit extends Component {
  state = {
    canSignIn: false,
    signingIn: false,
    loading: false
  }
  setAccountKit = () => (window.AccountKit_OnInteractive = this.onLoad)

  componentDidMount() {
    const {autoLogin} = this.props
    if (!window.AccountKit) {
      const {language} = this.props
      const tag = document.createElement('script')
      tag.setAttribute('src', `https://sdk.accountkit.com/${language}/sdk.js`)
      tag.setAttribute('id', 'account-kit')
      tag.setAttribute('type', 'text/javascript')
      tag.onload = this.setAccountKit
      document.head.appendChild(tag)
    } else {
      if (autoLogin) {
        this.signIn()
      }
    }

    const accountkitinit = getCookie('accountkitinit')

    if (accountkitinit) {
      const jwt = getCookie('jwt')
      const id = getCookie('currentUserId')
      const role = getCookie('userRole')

      const userInfo = {
        jwt,
        accountKitSignIn: {
          user: {
            id,
            role
          }
        }
      }

      this.setState({userInfo, loading: false})
    }
  }

  onLoad = () => {
    const {appId, csrf, version, autoLogin} = this.props
    window.AccountKit.init({
      appId,
      state: csrf,
      version,
      fbAppEventsEnabled: true,
      display: 'modal'
    })
    if (autoLogin) {
      this.signIn()
    }
  }

  signIn = () => {
    const {loginType, countryCode, phoneNumber, emailAddress, onSuccess} = this.props

    const options = {}
    if (countryCode) {
      options.countryCode = countryCode
    }

    if (loginType === 'PHONE' && phoneNumber) {
      options.phoneNumber = phoneNumber
    } else if (loginType === 'EMAIL' && emailAddress) {
      options.emailAddress = emailAddress
    }

    window.AccountKit.login(loginType, options, async (resp) => {
      const userInfo = await this.onSuccess(resp)
      if (onSuccess) {
        onSuccess(userInfo)
      }
    })
  }

  onSuccess = async (resp) => {
    const {code} = resp
    const {appId, appSecret, skipRedirect} = this.props

    if (code) {
      this.setState({loading: true})
      const data = await fetch(
        `https://graph.accountkit.com/v1.0/access_token?grant_type=authorization_code&code=${code}&
        access_token=AA%7C${appId}%7C${appSecret}`
      )

      const signInInfo = await data.json()

      const userInfo = await this.serverSignIn({
        variables: {
          accessToken: signInInfo.access_token
        }
      })

      const user = {
        jwt: userInfo.data.accountKitSignIn.jwt,
        id: parseInt(userInfo.data.accountKitSignIn.user.id),
        role: userInfo.data.accountKitSignIn.user.role
      }

      signUpUser(user)

      if (skipRedirect) {
        return userInfo
      }

      if (
        userInfo.data.accountKitSignIn.user.email &&
        userInfo.data.accountKitSignIn.user.name
      ) {
        this.setState({loading: false})
        redirect(getCookie('redirectTo') || '/')
      } else {
        this.setState({userInfo: userInfo.data, loading: false})
        setCookie('accountkitinit', 1)
      }
    }
  }

  render() {
    const {signIn} = this
    const {children} = this.props
    const {userInfo, loading} = this.state

    return (
      <Fragment>
        <Mutation mutation={SIGN_IN_ACCOUNT_KIT}>
          {(serverSignIn, {data, loading: signingIn}) => {
            this.serverSignIn = serverSignIn
            return children({
              signIn,
              loading: signingIn || loading,
              userInfo: data ? data.accountKitSignIn : null
            })
          }}
        </Mutation>
        {userInfo && <UserInfo userInfo={userInfo} />}
      </Fragment>
    )
  }
}

AccountKit.propTypes = {
  csrf: PropTypes.string.isRequired,
  appId: PropTypes.string,
  appSecret: PropTypes.string,
  version: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  loginType: PropTypes.oneOf(['PHONE', 'EMAIL']),
  language: PropTypes.string,
  countryCode: PropTypes.string,
  phoneNumber: PropTypes.string,
  emailAddress: PropTypes.string,
  autoLogin: PropTypes.bool,
  skipRedirect: PropTypes.bool
}

AccountKit.defaultProps = {
  language: 'pt_BR',
  loginType: 'PHONE',
  countryCode: '+55',
  phoneNumber: '',
  csrf: 'RANDOMCSRF',
  skipRedirect: false
}

export default AccountKit
