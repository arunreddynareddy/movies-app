import Cookies from 'js-cookie'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const isAccount = true

const userName = Cookies.get('user_name')

const Account = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    Cookies.remove('user_name')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="account-container">
      <Header isAccount={isAccount} />
      <div className="account-card">
        <h1 className="account-heading">Account</h1>
        <hr className="hr-line" />
        <div className="account-details-container">
          <p className="details-heading">Member Ship</p>
          <div className="personal-details-container">
            <p className="account-username">{userName}@gmail.com</p>
            <p className="account-password">Password : ************</p>
          </div>
        </div>
        <hr className="hr-line" />
        <div className="account-details-container">
          <p className="details-heading">Plan Details</p>
          <div className="premium-details-container">
            <p className="account-type">Premium</p>
            <p className="account-type-span">Ultra HD</p>
          </div>
        </div>
        <hr className="hr-line" />
        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default Account
