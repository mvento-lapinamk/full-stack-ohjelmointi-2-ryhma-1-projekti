

export function FormatTime(time){
    const date = new Date(time)
    const formatDate = date.getDate().toString() + "." + 
    date.getMonth().toString() + "." + 
    date.getFullYear().toString() + " " + 
    date.getHours().toString() + "." + 
    date.getMinutes().toString() + "." + 
    date.getSeconds().toString()

    return formatDate
}