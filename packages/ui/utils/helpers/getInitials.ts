const getInitials = (name: string = '') => {
  let initials = ''
  if (name) initials += name[0].toUpperCase() + name[1].toUpperCase()
  return initials
}

export default getInitials
