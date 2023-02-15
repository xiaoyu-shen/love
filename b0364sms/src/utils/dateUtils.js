export function formatDate(time) {
    if (!time) return ''
    let date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let mintue = date.getMinutes()
    let seconds = date.getSeconds()
    month = month < 10 ? "0" + month : month
    day = day < 10 ? "0" + day : day
    hour = hour < 10 ? "0" + hour : hour
    mintue = mintue < 10 ? "0" + mintue : mintue
    seconds = seconds < 10 ? "0" + seconds : seconds
    return year + '-' + month + '-' + day + '-' + hour + ':' + mintue + ':' + seconds
}

export function formatDateNoTime(time) {
    if (!time) return ''
    let date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let mintue = date.getMinutes()
    let seconds = date.getSeconds()
    month = month < 10 ? "0" + month : month
    day = day < 10 ? "0" + day : day
    hour = hour < 10 ? "0" + hour : hour
    mintue = mintue < 10 ? "0" + mintue : mintue
    seconds = seconds < 10 ? "0" + seconds : seconds
    return year + '-' + month + '-' + day
}