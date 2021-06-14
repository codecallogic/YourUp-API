const rooms = []
const onlineUsers = []
const mixerUsers = []

exports.addOnlineUser = ({id, name, email, photo, room}) => {
  name = name.trim().toLowerCase()

  const existingUser = onlineUsers.find((user) => user.email === email)

  if(existingUser) return {error: 'Username with email is already online.'}

  const onlineUser = {id, name, email, photo, room}

  onlineUsers.push(onlineUser)

  // console.log(onlineUsers)
  return {onlineUser, onlineUsers}
}

exports.addMixerUser = ({id, name, email, photo, room}) => {
  console.log(name)
  name = name.trim().toLowerCase()

  const existingUser = mixerUsers.find((user) => user.email === email)

  if(existingUser) return {error: 'Username with email is already online.'}

  const mixerUser = {id, name, email, photo, room}

  mixerUsers.push(mixerUser)

  // console.log(onlineUsers)
  return {mixerUser, mixerUsers}
}

exports.removeOnlineUser = (id) => {
  const index = onlineUsers.findIndex((user) => user.id === id)
  if(index !== -1){
    onlineUsers.splice(index, 1)
    return onlineUsers
  }
}

exports.removeMixerUser = (id) => {
  const index = mixerUsers.findIndex((user) => user.id === id)
  if(index !== -1){
    mixerUsers.splice(index, 1)
    return mixerUsers
  }
}

exports.removeRoom = (id) => {
  const index = rooms.findIndex((room) => room.id === id)
  if(index !== -1){
    rooms.splice(index, 1)
    return rooms
  }
}

exports.addRoom = ({id, room}) => {
  // console.log(id, room)
  roomName = room.trim().toLowerCase()

  const existingRoom = rooms.find((room) => room.roomName === roomName)

  if(existingRoom) return {error: 'Room with that name already exists'}

  const onlineRoom = {id, roomName}

  rooms.push(onlineRoom)

  // console.log(rooms)

  return {rooms}
}

exports.getUserInRoom = (room) => {
  return onlineUsers.filter((user) => user.room === room)
}

exports.getMixerUsers = () => {
  return mixerUsers
}