import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Header from '../Header'
import Footer from '../Footer'
import FailureView from '../FailureView'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const isPopular = true

class Popular extends Component {
  state = {
    apiStatus: apiConstants.initial,
    popularMoviesList: [],
  }

  componentDidMount() {
    this.getPopularMoviesList()
  }

  getFormattedData = eachMovie => ({
    backdropPath: eachMovie.backdrop_path,
    id: eachMovie.id,
    overview: eachMovie.overview,
    posterPath: eachMovie.poster_path,
    title: eachMovie.title,
  })

  getPopularMoviesList = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const popularUrl = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(popularUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.results.map(eachMovie =>
        this.getFormattedData(eachMovie),
      )
      this.setState({
        apiStatus: apiConstants.success,
        popularMoviesList: formattedData,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onRetryApi = () => {
    this.getPopularMoviesList()
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {popularMoviesList} = this.state
    return (
      <div className="success-container">
        <ul className="popular-list-container">
          {popularMoviesList.map(eachMovie => (
            <Link
              to={`/movies/${eachMovie.id}`}
              className="popular-link-item"
              key={eachMovie.id}
            >
              <li className="popular-list-item" key={eachMovie.id}>
                <img
                  src={eachMovie.backdropPath}
                  alt={eachMovie.title}
                  className="popular-list-image"
                />
              </li>
            </Link>
          ))}
        </ul>
        <Footer />
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
      <div className="popular-container">
        <Header isPopular={isPopular} />
        {this.renderApiStatusView()}
      </div>
    )
  }
}

export default Popular
