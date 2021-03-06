const querystring = require('query-string');
const request = require('request')
const axios = require('axios')
const Buffer = require('buffer/').Buffer

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
        'Authorization': 'Basic ' + (Buffer(
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
  const {spotifyURI, newToken, activateDevice} = req.body
  console.log(req.body)
  
  try {
    const responsePlay = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${activateDevice}`, {"uris": [`${spotifyURI}`], },{
      headers: {
        Accept: 'application/json',
        ContentType: 'application/json',
        Authorization: `Bearer ${newToken}`,
      }
    })

    const responseCurrentPlaybackState = await axios.get(`https://api.spotify.com/v1/me/player`, {
      headers: {
        Accept: 'application/json',
        ContentType: 'application/json',
        Authorization: `Bearer ${newToken}`,
      }
    })
    return res.json(responseCurrentPlaybackState.data)
  } catch (error) {
    console.log(error)
    console.log(error ? error.response ? console.log(error.response.data) : error : 'Error')
    return res.send('Error')
  }
}

exports.activateDevice = async (req, res) => {

  let deviceIDs = req.body.device_ids

  try {
    const responseActivate = await axios.put(`https://api.spotify.com/v1/me/player`, {device_ids: deviceIDs}, {
      headers: {
        Accept: 'application/json',
        ContentType: 'application/json',
        Authorization: `Bearer ${req.body.newToken}`,
      }
    })
    console.log(responseActivate.data)
    return res.json(responseActivate.data)
  } catch (error) {
    console.log(error)
    if(error) error ? error.response ? console.log(error.response.data.error) : console.log(error) : console.log(error)
    return res.json('Error activating a device')
  }
}

exports.removeCookie = (req, res) => {
  res.clearCookie('spotifyToken')
  res.clearCookie('user')
  return res.json('Cookie removed');
}

exports.decreaseVolume = async (req, res) => {
  const {newToken} = req.body
  console.log(newToken)

  try {
    const responseDecreaseVolume = await axios.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=20`, {}, {
      headers: {
        Accept: 'application/json',
        ContentType: 'application/json',
        Authorization: `Bearer ${newToken}`,
      }
    })
    console.log(responseDecreaseVolume.data)
    return res.send('Volume decreased')
  } catch (error) {
    console.log(error.response.data.error)
  }
}

exports.increaseVolume = async (req, res) => {
  const {newToken} = req.body

  try {
    let timesRunFirstInterval = 0;
    let firstRun = setInterval( async () => {
      const responseIncreaseVolume = await axios.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=35`, {}, {
        headers: {
          Accept: 'application/json',
          ContentType: 'application/json',
          Authorization: `Bearer ${newToken}`,
        }
      })

      timesRunFirstInterval += 1;
      if(timesRunFirstInterval === 1){
        clearInterval(firstRun);
      }

      // console.log(responseIncreaseVolume)
    }, 250)

    let timesRunSecondInterval = 0;
    let secondInterval = setInterval( async () => {
      const responseIncreaseVolume = await axios.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=45`, {}, {
        headers: {
          Accept: 'application/json',
          ContentType: 'application/json',
          Authorization: `Bearer ${newToken}`,
        }
      })

      timesRunSecondInterval += 1;
      if(timesRunSecondInterval  === 1){
        clearInterval(secondInterval);
      }

      // console.log(responseIncreaseVolume)
    }, 500)

    let timesRunThirdInterval = 0;
    let thirdInterval = setInterval( async () => {
      const responseIncreaseVolume = await axios.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=55`, {}, {
        headers: {
          Accept: 'application/json',
          ContentType: 'application/json',
          Authorization: `Bearer ${newToken}`,
        }
      })

      timesRunThirdInterval += 1;
      if(timesRunThirdInterval  === 1){
        clearInterval(thirdInterval);
      }

      // console.log(responseIncreaseVolume)
    }, 750) 

    let timesRunFourthInterval = 0;
    let fourthInterval = setInterval( async () => {
      const responseIncreaseVolume = await axios.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=70`, {}, {
        headers: {
          Accept: 'application/json',
          ContentType: 'application/json',
          Authorization: `Bearer ${newToken}`,
        }
      })

      timesRunFourthInterval += 1;
      if(timesRunFourthInterval  === 1){
        clearInterval(fourthInterval);
      }

      // console.log(responseIncreaseVolume)
    }, 1000) 
    
    return res.send('Volume increased')
  } catch (error) {
    console.log(error)
  }
}

exports.test = async (req, res) => {
  console.log(req.body)
  const headerOptions = {
    Accept: 'application/json',
    ContentType: 'application/json',
    Authorization: `Bearer ${process.env.TELNYX}`,
  }
  
  try {
    const responseMessage = await axios.post(`https://api.telnyx.com/v2/messages`, {from: '+16182173013', to: req.body.toUser, text: req.body.message}, {headers: headerOptions})
    console.log(responseMessage)
    console.log(responseMessage.data.data.cost)
    console.log(responseMessage.data.data.from)
    console.log(responseMessage.data.data.to)
    res.send('HTTPS request sent')
  } catch (error) {
    console.log(error.response.data)
    console.log(error.response.data.errors[0].meta)
  }
}