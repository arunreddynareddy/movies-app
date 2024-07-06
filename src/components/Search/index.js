import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Header from '../Header'
import FailureView from '../FailureView'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const isSearchRoute = true

class Search extends Component {
  state = {
    apiStatus: apiConstants.initial,
    searchedMoviesList: [],
    searchInput: '',
  }

  getFormattedData = eachMovie => ({
    backdropPath: eachMovie.backdrop_path,
    id: eachMovie.id,
    overview: eachMovie.overview,
    posterPath: eachMovie.poster_path,
    title: eachMovie.title,
  })

  getSearchedMoviesList = async searchInput => {
    this.setState({apiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const searchUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(searchUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.results.map(eachMovie =>
        this.getFormattedData(eachMovie),
      )
      this.setState({
        apiStatus: apiConstants.success,
        searchedMoviesList: formattedData,
        searchInput,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onRetryApi = () => {
    this.getSearchedMoviesList()
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {searchedMoviesList, searchInput} = this.state
    return searchedMoviesList.length === 0 ? (
      <div className="no-results-container">
        <img
          src="https://res.cloudinary.com/dptc4np08/image/upload/v1720057403/no-results-image-large_k0hj6m.png"
          alt="no movies"
          className="no-results-image"
        />
        <p className="mobile-no-results-description">
          Your search for {`${searchInput}`} <br /> did not find any matches.
        </p>
        <p className="desktop-no-results-description">
          Your search for {`${searchInput}`} did not find any matches.
        </p>
      </div>
    ) : (
      <div className="success-container">
        <ul className="searched-list-container">
          {searchedMoviesList.map(eachMovie => (
            <Link
              to={`/movies/${eachMovie.id}`}
              className="searched-link-item"
              key={eachMovie.id}
            >
              <li className="searched-list-item" key={eachMovie.id}>
                <img
                  src={eachMovie.backdropPath}
                  alt={eachMovie.title}
                  className="searched-list-image"
                />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => <FailureView onRetry={this.onRetryApi} />

  renderApiStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoaderView()
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="searched-container">
        <Header
          getSearchedMoviesList={this.getSearchedMoviesList}
          isSearchRoute={isSearchRoute}
        />
        {this.renderApiStatusView()}
      </div>
    )
  }
}

export default Search
