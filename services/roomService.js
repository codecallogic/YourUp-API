const roomUsers = []
const onlineUsers = []

exports.addOnlineUser = ({id, name, email, photo}) => {
  console.log(id, name, email, photo)
  name = name.trim().toLowerCase()

  const existinUser = onlineUsers.find((user) => user.email === email && user.name === name)

  if(existinUser) return {error: 'Username with email is already online.'}

  const onlineUser = {id, name, email, photo}

  onlineUsers.push(onlineUser)

  return {onlineUsers}
}

exports.removeOnlineUser = (id) => {
  const index = onlineUsers.findIndex((user) => user.id === id)
  if(index !== -1){
      return onlineUsers.splice(index, 1)[0]
  }
}

const addUser = ({ id, name, room}) => {
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()

  const existingUser = users.find((user) => user.room === room && user.name === name)

  if(existingUser){
      return { error: 'Username is taken'}
  }

  const user = { id, name, room }

  users.push(user)

  return { user }
}