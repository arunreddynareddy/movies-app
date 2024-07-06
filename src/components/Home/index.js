import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const isHome = true

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {
    trendingApiStatus: apiConstants.initial,
    topRatedApiStatus: apiConstants.initial,
    originalApiStatus: apiConstants.initial,
    randomApiStatus: apiConstants.initial,
    trendingMoviesList: [],
    topRatedMoviesList: [],
    originalsMoviesList: [],
    randomMovie: {},
  }

  componentDidMount() {
    this.getTrendingNowMoviesList()
    this.getTopRatedMoviesList()
    this.getOriginalResponseMoviesList()
  }

  getFormattedData = eachMovie => ({
    backdropPath: eachMovie.backdrop_path,
    id: eachMovie.id,
    overview: eachMovie.overview,
    posterPath: eachMovie.poster_path,
    title: eachMovie.title,
  })

  getTrendingNowMoviesList = async () => {
    this.setState({trendingApiStatus: apiConstants.inProgress})
    const trendingUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const trendingResponse = await fetch(trendingUrl, options)
    if (trendingResponse.ok === true) {
      const trendingData = await trendingResponse.json()
      const trendingUpdatedData = trendingData.results.map(eachMovie =>
        this.getFormattedData(eachMovie),
      )
      this.setState({
        trendingApiStatus: apiConstants.success,
        trendingMoviesList: trendingUpdatedData,
      })
    } else {
      this.setState({trendingApiStatus: apiConstants.failure})
    }
  }

  getTopRatedMoviesList = async () => {
    this.setState({topRatedApiStatus: apiConstants.inProgress})
    const topRatedUrl = 'https://apis.ccbp.in/movies-app/top-rated-movies'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const topRatedResponse = await fetch(topRatedUrl, options)
    if (topRatedResponse.ok === true) {
      const topRatedData = await topRatedResponse.json()
      const topRatedUpdatedData = topRatedData.results.map(eachMovie =>
        this.getFormattedData(eachMovie),
      )
      this.setState({
        topRatedApiStatus: apiConstants.success,
        topRatedMoviesList: topRatedUpdatedData,
      })
    } else {
      this.setState({topRatedApiStatus: apiConstants.failure})
    }
  }

  getOriginalResponseMoviesList = async () => {
    this.setState({
      originalApiStatus: apiConstants.inProgress,
      randomApiStatus: apiConstants.inProgress,
    })
    const originalsUrl = 'https://apis.ccbp.in/movies-app/originals'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const originalsResponse = await fetch(originalsUrl, options)
    if (originalsResponse.ok === true) {
      const originalsData = await originalsResponse.json()
      const originalUpdatedData = originalsData.results.map(eachMovie =>
        this.getFormattedData(eachMovie),
      )
      const randomMovieIndex = Math.floor(
        Math.random() * originalUpdatedData.length,
      )
      const randomMovie = originalUpdatedData[randomMovieIndex]
      this.setState({
        originalApiStatus: apiConstants.success,
        randomApiStatus: apiConstants.success,
        originalsMoviesList: originalUpdatedData,
        randomMovie,
      })
    } else {
      this.setState({
        originalApiStatus: apiConstants.failure,
        randomApiStatus: apiConstants.failure,
      })
    }
  }

  onRetryTrendingApi = () => {
    this.getTrendingNowMoviesList()
  }

  onRetryTopRatedApi = () => {
    this.getTopRatedMoviesList()
  }

  onRetryOriginalsAPi = () => {
    this.getOriginalResponseMoviesList()
  }

  renderRandomProgressView = () => (
    <div className="random-details-container">
      <Header isHome={isHome} />
      <div className="random-loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </div>
  )

  renderRandomSuccessView = () => {
    const {randomMovie} = this.state
    const {id, backdropPath, overview, title} = randomMovie

    return (
      <div
        className="random-header-movie-container"
        style={{backgroundImage: `url(${backdropPath})`}}
      >
        <Header isHome={isHome} />
        <div className="random-movie-details-container">
          <h1 className="random-details-heading">{title}</h1>
          <p className="random-details-description">{overview}</p>
          <button type="button" className="random-details-button">
            Play
          </button>
          <Link to={`/movies/${id}`} className="home-link">
            <button type="button" className="random-info-button">
              More Info
            </button>
          </Link>
        </div>
      </div>
    )
  }

  renderRandomFailureView = () => (
    <div className="random-details-container">
      <Header isHome={isHome} />
      <div className="random-failure-container">
        <img
          src="https://res.cloudinary.com/dptc4np08/image/upload/v1720186423/alert-triangle_digwvg.png"
          alt="failure view"
          className="random-failure-image"
        />
        <p className="random-failure-description">
          Something went wrong. Please try again
        </p>
        <button
          type="button"
          className="random-failure-button"
          onClick={this.onRetryOriginalsAPi}
        >
          Try Again
        </button>
      </div>
    </div>
  )

  renderRandomMovieView = () => {
    const {randomApiStatus} = this.state
    switch (randomApiStatus) {
      case apiConstants.inProgress:
        return this.renderRandomProgressView()
      case apiConstants.success:
        return this.renderRandomSuccessView()
      case apiConstants.failure:
        return this.renderRandomFailureView()
      default:
        return null
    }
  }

  renderLoaderView = () => (
    <div className="home-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={30} width={30} />
    </div>
  )

  renderSuccessView = moviesList => (
    <div className="slider-container">
      <Slider {...settings}>
        {moviesList.map(eachMovie => {
          const {id, backdropPath, title} = eachMovie
          return (
            <Link to={`/movies/${id}`} key={id} className="home-link">
              <div className="slide-container">
                <img className="movie-image" src={backdropPath} alt={title} />
              </div>
            </Link>
          )
        })}
      </Slider>
    </div>
  )

  renderFailureView = retryApi => (
    <div className="home-failure-container">
      <img
        src="https://res.cloudinary.com/dptc4np08/image/upload/v1720186423/alert-triangle_digwvg.png"
        alt="failure view"
        className="home-failure-image"
      />
      <p className="home-failure-description">
        Something went wrong. Please try again
      </p>
      <button type="button" className="home-failure-button" onClick={retryApi}>
        Try Again
      </button>
    </div>
  )

  renderTrendingMoviesView = () => {
    const {trendingApiStatus, trendingMoviesList} = this.state
    switch (trendingApiStatus) {
      case apiConstants.inProgress:
        return this.renderLoaderView()
      case apiConstants.success:
        return this.renderSuccessView(trendingMoviesList)
      case apiConstants.failure:
        return this.renderFailureView(this.onRetryTrendingApi)
      default:
        return null
    }
  }

  renderTopRatedMoviesView = () => {
    const {topRatedApiStatus, topRatedMoviesList} = this.state
    switch (topRatedApiStatus) {
      case apiConstants.inProgress:
        return this.renderLoaderView()
      case apiConstants.success:
        return this.renderSuccessView(topRatedMoviesList)
      case apiConstants.failure:
        return this.renderFailureView(this.onRetryTopRatedApi)
      default:
        return null
    }
  }

  renderOriginalsMoviesView = () => {
    const {originalApiStatus, originalsMoviesList} = this.state
    switch (originalApiStatus) {
      case apiConstants.inProgress:
        return this.renderLoaderView()
      case apiConstants.success:
        return this.renderSuccessView(originalsMoviesList)
      case apiConstants.failure:
        return this.renderFailureView(this.onRetryOriginalsAPi)
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        {this.renderRandomMovieView()}
        <div className="movies-list-container">
          <h1 className="list-heading">Trending Now</h1>
          {this.renderTrendingMoviesView()}
          <h1 className="list-heading">Top Rated</h1>
          {this.renderTopRatedMoviesView()}
          <h1 className="list-heading">Originals</h1>
          {this.renderOriginalsMoviesView()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
