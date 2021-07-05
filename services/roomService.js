const rooms = []
const onlineUsers = []
const mixerUsers = []

exports.addOnlineUser = ({id, name, email, photoURL, room}) => {
  name = name.trim().toLowerCase()

  const existingUser = onlineUsers.find((user) => user.email === email)

  if(existingUser) return {error: 'Username with email is already online.'}

  const onlineUser = {id, name, email, photoURL, room}

  onlineUsers.push(onlineUser)

  // console.log(onlineUsers)
  return {onlineUser, onlineUsers}
}

exports.addMixerUser = ({id, name, email, photoURL, room}) => {
  // console.log(name)
  name = name.trim().toLowerCase()

  const existingUser = mixerUsers.find((user) => user.email === email)

  if(existingUser) return {error: 'Username with email is already online.'}

  const mixerUser = {id, name, email, photoURL, room}

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

exports.addRoom = ({id, room, pin}) => {
  // console.log(id, room)
  roomName = room.trim().toLowerCase()

  const existingRoom = rooms.find((room) => room.room === room)

  if(existingRoom) return {error: 'Room with that name already exists'}

  const onlineRoom = {id, room, pin}

  rooms.push(onlineRoom)

  // console.log(rooms)

  return {rooms}
}

exports.getUserInRoom = (room) => {
  return onlineUsers.filter((user) => user.room === room)
}

exports.allRooms = () => {
  return {rooms}
}

exports.enterRoom = ({pin}) => {
  const existingRoom = rooms.find((room) => {if(room.pin == pin) return room})
  
  if(!existingRoom) return {error: 'Room with that pin does not exists'}
  
  return {existingRoom}
}

exports.getMixerUsers = () => {
  return mixerUsers
}