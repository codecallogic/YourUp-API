const axios = require('axios')

exports.invite = async (req, res) => {
  const headerOptions = {
    Accept: 'application/json',
    ContentType: 'application/json',
    Authorization: `Bearer ${process.env.TELNYX}`,
  }

  console.log(req.body)
  
  try {
    const responseMessage = await axios.post(`https://api.telnyx.com/v2/messages`, {from: '+16182173013', to: req.body.toUser, text: req.body.message}, {headers: headerOptions})
    console.log(responseMessage)
    console.log(responseMessage.data.data.cost)
    console.log(responseMessage.data.data.from)
    console.log(responseMessage.data.data.to)
    return res.json(responseMessage.data)
  } catch (error) {
    // console.log(error)
    console.log(error.response.data.errors[0].meta)
  }
}