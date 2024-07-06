import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onLoginSuccess = jwtToken => {
    const {username} = this.state
    Cookies.set('jwt_token', jwtToken, {expires: 7})
    Cookies.set('user_name', username, {expires: 7})
    const {history} = this.props
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderUsername = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username" className="form-label">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="form-input"
          value={username}
          placeholder="Username"
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderPassword = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password" className="form-label">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="form-input"
          value={password}
          placeholder="Password"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {showErrorMsg, errorMsg} = this.state
    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dptc4np08/image/upload/v1719832974/movies_app_logo_ivoob0.png"
          alt="login website logo"
          className="website-logo"
        />
        <div className="login-card">
          <form className="form-container" onSubmit={this.onSubmitLoginForm}>
            <h1 className="form-heading">Login</h1>
            {this.renderUsername()}
            {this.renderPassword()}
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
            <button type="submit" className="login-button mobile-button">
              Sign in
            </button>
            <button type="submit" className="login-button desktop-button">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
