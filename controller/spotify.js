const querystring = require('query-string');
const request = require('request')

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
      json: true
  }

  request.post(authOptions, function(error, response, body) {
      let access_token = body.access_token
      let uri = process.env.SPOTIFY_FRONTEND_URI
      res.redirect(uri + '?access_token=' + access_token)
  })
}