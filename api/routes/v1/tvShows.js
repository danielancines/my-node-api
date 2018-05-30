const router = require('express').Router()
const bodyParser = require('body-parser')
const config = require('./../../config')
const path = require('path')
const axios = require('axios')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/', (req, res) => {
    res.send({
        message: 'Availables operations',
        versions: {
            v1: {
                searchTvShowByName: path.join(config.api_base_v1, config.tvShowEndpoint, 'search/{tvshowname}')
            }
        }
    })
})

router.get('/tvshows', (req,res) =>{
    res.send('tvshows')
})

router.get('/tvshows/search', async (req, res) => {
    const page = req.query.page || 1
    const term = req.query.q || 'simpson'

    const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${config.api_key}&language=en-US&query=${term}&page=${page}`)
    if (response === undefined) {
        return res.status(400).send('TvShow not found')
    }

    if (!response.data || response.data.results.length <= 0) {
        return res.status(404).send({
            term: req.params.tvShowName,
            message: 'Tv Show not found'
        })
    }

    const result = {
        page: req.params.page,
        totalResults: response.data.total_results,
        totalPages: response.data.total_pages,
        tvShows: []
    }

    response.data.results.map(tvshow => {
        result.tvShows.push({
            id: tvshow.id,
            name: tvshow.name,
            firstAirDate: tvshow.first_air_date,
            overview: tvshow.overview,
            poster: config.tvShowPosterBaseURI + tvshow.poster_path
        })
    })

    res.status(200).send(result)
})

router.get('/tvshows/search/:tvShowId/seasons', async (req, res) => {
    const tvShowId = req.params.tvShowId
    if (!tvShowId) return res.status(400).send({
        message: 'Parameter TvShowId not found'
    })

    const response = await axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${config.api_key}&language=en-US`)
    if (response === undefined) {
        return res.status(400).send('TvShow not found')
    }

    const result = response.data

    const tvShow = {
        id: result.id,
        name: result.name,
        overview: result.overview,
        airDate: result.last_air_date,
        poster: config.tvShowPosterBaseURI + result.poster_path,
        seasons: []
    }

    result.seasons.map(season =>{
        tvShow.seasons.push({
            id: season.id,
            name: season.name,
            overview: season.overview,
            poster: config.tvShowPosterBaseURI + season.poster_path,
            number: season.season_number,
            episodes: season.episode_count
        })
    })

    res.status(200).send(tvShow)
})

router.get('/tvshows/search/:tvShowId/seasons/:seasonNumber', async (req, res) => {
    const tvShowId = req.params.tvShowId
    if (!tvShowId) return res.status(400).send({
        message: 'Parameter TvShowId not found'
    })

    const seasonNumber = req.params.seasonNumber
    if (!seasonNumber) return res.status(400).send({
        message: 'Parameter SeasonNumber not found'
    })

    const response = await axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=${config.api_key}&language=en-US`)
    if (response === undefined) {
        return res.status(400).send('Episodes not found')
    }

    const result = response.data

    const tvShow = {
        id: result._id,
        airDate: result.air_date,
        episodes: []
    }

    result.episodes.map(episode =>{
        tvShow.episodes.push({
            id: episode.id,
            number: episode.episode_number,
            name: episode.name,
            overview: episode.overview,
            seasonNumber: episode.season_number,
            episodes: episode.episode_count,
            airDate: episode.air_date,
            poster: config.tvShowPosterBaseURI + episode.still_path
        })
    })

    res.status(200).send(tvShow)
})

module.exports = router