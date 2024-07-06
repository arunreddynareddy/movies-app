import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import format from 'date-fns/format'

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

class MovieDetails extends Component {
  state = {
    apiStatus: apiConstants.initial,
    movieDetails: {},
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  getFormattedData = movie => ({
    adult: movie.adult,
    backdropPath: movie.backdrop_path,
    budget: movie.budget,
    genres: movie.genres.map(eachGenre => ({
      id: eachGenre.id,
      name: eachGenre.name,
    })),
    id: movie.id,
    overview: movie.overview,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date,
    runtime: movie.runtime,
    similarMovies: movie.similar_movies.map(eachMovie => ({
      backdropPath: eachMovie.backdrop_path,
      id: eachMovie.id,
      posterPath: eachMovie.poster_path,
      title: eachMovie.title,
    })),
    spokenLanguages: movie.spoken_languages.map(eachLanguage => ({
      englishName: eachLanguage.english_name,
      id: eachLanguage.id,
    })),
    title: movie.title,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
  })

  getMovieDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const movieDetailsUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(movieDetailsUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = this.getFormattedData(data.movie_details)
      this.setState({
        apiStatus: apiConstants.success,
        movieDetails: formattedData,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onRetryApi = () => {
    this.getMovieDetails()
  }

  renderLoaderView = () => (
    <div className="movie-container">
      <Header />
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </div>
  )

  renderSuccessView = () => {
    const {movieDetails} = this.state
    const {
      adult,
      backdropPath,
      budget,
      genres,
      overview,
      releaseDate,
      runtime,
      similarMovies,
      spokenLanguages,
      title,
      voteAverage,
      voteCount,
    } = movieDetails

    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60

    return (
      <>
        <div
          className="movie-description-container"
          style={{
            backgroundImage: `url(${backdropPath})`,
            backgroundSize: 'cover',
          }}
        >
          <Header />
          <div className="description-container">
            <h1 className="description-heading">{title}</h1>
            <div className="censor-details-container">
              <p className="censor-description">
                {hours}h {minutes}m
              </p>
              {adult ? (
                <p className="censor-description censor-rating">A</p>
              ) : (
                <p className="censor-description censor-rating">U/A</p>
              )}
              <p className="censor-description">
                {format(new Date(releaseDate), 'yyyy')}
              </p>
            </div>
            <p className="description">{overview}</p>
            <button type="button" className="description-button">
              Play
            </button>
          </div>
        </div>
        <div className="movie-details-container">
          <div className="movie-numbers-container">
            <div className="numbers-container">
              <h1 className="numbers-heading">Genres</h1>
              <ul className="numbers-list-container">
                {genres.map(eachGenre => (
                  <li className="number-list-item" key={eachGenre.id}>
                    <p className="number-list-name">{eachGenre.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="numbers-container">
              <h1 className="numbers-heading">Audio Available</h1>
              <ul className="numbers-list-container">
                {spokenLanguages.map(eachLanguage => (
                  <li className="number-list-item" key={eachLanguage.id}>
                    <p className="number-list-name">
                      {eachLanguage.englishName}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="numbers-container">
              <h1 className="numbers-heading">Rating Count</h1>
              <p className="number-list-item">{voteCount}</p>
              <h1 className="numbers-heading">Rating Average</h1>
              <p className="number-list-item">{voteAverage}</p>
            </div>
            <div className="numbers-container">
              <h1 className="numbers-heading">Budget</h1>
              <p className="number-list-item">{budget}</p>
              <h1 className="numbers-heading">Release Date</h1>
              <p className="number-list-item">
                {format(new Date(releaseDate), 'do MMMM yyyy')}
              </p>
            </div>
          </div>
          <h1 className="similar-list-heading">More like this</h1>
          <ul className="similar-list-container">
            {similarMovies.map(eachMovie => (
              <li key={eachMovie.id} className="similar-list-item">
                <img
                  src={eachMovie.backdropPath}
                  alt={eachMovie.title}
                  className="similar-list-image"
                />
              </li>
            ))}
          </ul>
        </div>
        <Footer />
      </>
    )
  }

  renderFailureView = () => (
    <div className="movie-container">
      <Header />
      <FailureView onRetry={this.onRetryApi} />
    </div>
  )

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
    return <div className="movie-container">{this.renderApiStatusView()}</div>
  }
}

export default MovieDetails
