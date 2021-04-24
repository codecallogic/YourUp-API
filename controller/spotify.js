const querystring = require('query-string');
const request = require('request')
const axios = require('axios')

exports.login = async (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?'+
  querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: process.env.SPOTIFY_SCOPES,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  }));
}

exports.callback = async (req, res) => {
  let code = req.query.code

  let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET
        ).toString('base64'))
      },
      withCredentials: true,
      json: true
  }

  request.post(authOptions, function(error, response, body) {
    let access_token = body.access_token

    return res.redirect(`${process.env.SPOTIFY_FRONTEND_URI}?token=${access_token}`)
  })
}

exports.playSong = async (req, res) => {
  const {spotifyURI, newToken} = req.body
  
  try {
    const responsePlay = await axios.put(`https://api.spotify.com/v1/me/player/play`, {"uris": [`${spotifyURI}`]},{
      headers: {
        Accept: 'application/json',
        ContentType: 'application/json',
        Authorization: `Bearer ${newToken}`,
      }
    })
    // console.log(responsePlay)
    res.send('Success')
  } catch (error) {
    console.log(error.response.data)
    res.send('Error')
  }
}

exports.test = (req, res) => {
  res.send('Hello')
}