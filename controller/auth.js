exports.login = (req, res) => {
  const {displayName, email, photoURL} = req.body
  const userClient = {name: displayName, email, photoURL}
  console.log(req.body)

  return res.status(202).cookie("user", JSON.stringify(userClient), {
    sameSite: 'Lax',
    expires: new Date(new Date().getTime() + (60 * 60 * 1000)),
    httpOnly: true,
  })
  .send(userClient)
}