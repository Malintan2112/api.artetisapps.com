const dayjs = require('dayjs')
const dateParser = (date, addTime) => {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  let parsedDate = `${dayjs(date).get('date')} ${months[dayjs(date).get('month')]} ${dayjs(date).get('year')}`
  if (addTime) {
    const minute = dayjs(date).get('minute')
    const hour = dayjs(date).get('hour')
    parsedDate += ` ${(hour < 10) ? '0' + hour : hour}:${(minute < 10) ? '0' + minute : minute}`
  }
  return parsedDate
}
const dateParserEn = (date, addTime) => {
  if (date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let parsedDate = `${dayjs(date).get('date')} ${months[dayjs(date).get('month')]} ${dayjs(date).get('year')}`
    if (addTime) {
      const minute = dayjs(date).get('minute')
      const hour = dayjs(date).get('hour')
      parsedDate += ` ${(hour < 10) ? '0' + hour : hour}:${(minute < 10) ? '0' + minute : minute}`
    }
    return parsedDate
  } else return 'Tanggal belum terisi'
}

const miniFormat = (date, addTime) => {
  if (date) {
    const dayTime = dayjs(date).get('date')
    const monthTime = dayjs(date).get('month') + 1
    let parsedDate = `${dayTime >= 10 ? dayTime : `0${dayTime}`}/${monthTime >= 10 ? monthTime : `0${monthTime}`}/${dayjs(date).get('year') - 2000}`
    if (addTime) {
      const minute = dayjs(date).get('minute')
      const hour = dayjs(date).get('hour')
      parsedDate += ` ${(hour < 10) ? '0' + hour : hour}:${(minute < 10) ? '0' + minute : minute}`
    }
    return parsedDate
  } else return 'Date not found'
}
module.exports= {dateParser, dateParserEn, miniFormat}
