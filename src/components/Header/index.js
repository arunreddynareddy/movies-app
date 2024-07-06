import {Component} from 'react'
import {Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import {IoIosCloseCircle} from 'react-icons/io'
import {MdMenuOpen} from 'react-icons/md'

import './index.css'

class Header extends Component {
  state = {
    fullMenu: false,
    searchInput: '',
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    const {getSearchedMoviesList} = this.props
    const {searchInput} = this.state
    if (searchInput !== '') {
      getSearchedMoviesList(searchInput)
    }
  }

  showMenu = () => {
    this.setState({fullMenu: true})
  }

  hideMenu = () => {
    this.setState({fullMenu: false})
  }

  render() {
    const {isHome, isPopular, isSearchRoute, isAccount} = this.props
    const {fullMenu, searchInput} = this.state

    const displayMenu = fullMenu ? '' : 'display-menu'
    const homeRoute = isHome ? 'highlight' : ''
    const popularRoute = isPopular ? 'highlight' : ''
    const accountRoute = isAccount ? 'highlight' : ''
    const hideButton = isSearchRoute ? 'button' : ''
    const hideContainer = isSearchRoute ? '' : 'button'

    return (
      <nav className="nav-container">
        <div className="nav-card">
          <ul className="nav-list-container">
            <li className="list-item">
              <Link to="/" className="nav-link">
                <img
                  src="https://res.cloudinary.com/dptc4np08/image/upload/v1719832974/movies_app_logo_ivoob0.png"
                  alt="website logo"
                  className="nav-web-logo"
                />
              </Link>
            </li>
            <Link to="/" className="nav-link">
              <li className={`nav-list-item ${homeRoute}`}>Home</li>
            </Link>
            <Link to="/popular" className="nav-link">
              <li className={`nav-list-item ${popularRoute}`}>Popular</li>
            </Link>
          </ul>
          <ul className="nav-list-container">
            <Link to="/search" className={`nav-link ${hideButton}`}>
              <li className="list-item">
                <button
                  type="button"
                  testid="searchButton"
                  className="nav-button"
                >
                  <HiOutlineSearch size={24} color="#ffffff" />
                </button>
              </li>
            </Link>
            <li className={`list-item search-container ${hideContainer}`}>
              <input
                type="search"
                className="nav-search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                testid="searchButton"
                className="search-input-button"
                onClick={this.onClickSearchButton}
              >
                <HiOutlineSearch size={12} color="#ffffff" />
              </button>
            </li>
            <li className="list-item menu-icon">
              <button
                type="button"
                className="nav-button"
                onClick={this.showMenu}
              >
                <MdMenuOpen size={34} color="#ffffff" />
              </button>
            </li>
            <Link to="/account" className="nav-link-item">
              <li className="list-item">
                <img
                  src="https://res.cloudinary.com/dptc4np08/image/upload/v1719989685/Avatar_ujzcse.png"
                  alt="profile"
                  className="nav-profile-image"
                />
              </li>
            </Link>
          </ul>
        </div>
        <div className={`nav-menu-container ${displayMenu}`}>
          <ul className="nav-menu-list-container">
            <Link to="/" className="nav-menu-link">
              <li className={`menu-item ${homeRoute}`}>Home</li>
            </Link>
            <Link to="/popular" className="nav-menu-link">
              <li className={`menu-item ${popularRoute}`}>Popular</li>
            </Link>
            <Link to="/account" className="nav-menu-link">
              <li className={`menu-item ${accountRoute}`}>Account</li>
            </Link>
          </ul>
          <button
            type="button"
            className="close-button"
            onClick={this.hideMenu}
          >
            <IoIosCloseCircle size={24} color="#ffffff" />
          </button>
        </div>
      </nav>
    )
  }
}

export default Header
