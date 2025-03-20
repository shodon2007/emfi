export class CustomDate {
    static setYesterday(date) {
        const newDate = new Date(date.getTime());
        newDate.setDate(date.getDate() - 1)
        return newDate;
    }

    static getFormatDate(date) {
        let month = date.getMonth()
        let day = date.getDate();
        if (String(month).length < 2) {
            month = `0${month}`;
        }
        if (String(day).length < 2) {
            day = `0${day}`;
        }
        return `${day}.${month}.${date.getFullYear()}`;
    }
}
