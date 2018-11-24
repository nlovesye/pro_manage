export const addressToString = (address) => {
  try {
    if (typeof (address) === 'string' && address.startsWith('{')) {
      address = JSON.parse(address)
    } else if (typeof (address) === 'string') {
      return address
    }
  } catch (e) {
    // console.error('地址解析错误', e)
    return address
  }
  let s = ''
  if (address && address.pro && address.pro.name) {
    s += address.pro.name
  }

  if (address && address.city && address.city.name) {
    s += '/'
    s += address.city.name
  }

  if (address && address.dist && address.dist.name) {
    s += '/'
    s += address.dist.name
  }

  if (address && address.street && address.street.name) {
    s += '/'
    s += address.street.name
  }

  if (address && address.extra) {
    s += ' '
    s += address.extra
  }

  return s
}
