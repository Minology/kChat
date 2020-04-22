export default class MessageTime {
    constructor(time) {
        this.time = new Date(time);

        const week = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        this.day = week[this.time.getDay()];

        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        this.date = months[this.time.getMonth() - 1] + " " + this.time.getDate() + ", " + this.time.getFullYear();

        this.hours = this.time.getHours() < 12? this.time.getHours() : this.time.getHours() - 12;
        if (this.hours < 10) this.hours = '0' + this.hours;
        this.hoursSuffix = this.time.getHours() < 12? "AM" : "PM";
        this.minutes = this.time.getMinutes();
        if (this.minutes < 10) this.minutes = '0' + this.minutes;
    }

    toTimeString() {
        return this.hours + ":" + this.minutes + " " + this.hoursSuffix;
    }

    toString() {
        const now = new Date();
        let sameDayAsNow = false;
        let withinAWeek = false;

        if (this.time.getFullYear() == now.getFullYear()) {
            if (this.time.getMonth() == now.getMonth()) {
                if (now.getDate() - this.time.getDate() <= 7) {
                    withinAWeek = true;
                    if (now.getDate() == this.time.getDate()) sameDayAsNow = true;
                }
            }
        }

        if (sameDayAsNow) {
            return this.toTimeString();
        }
        else if (withinAWeek) {
            return this.day + " " + this.toTimeString();
        }
        else {
            return this.date + ", " + this.toTimeString();
        }
    }

    isOnSameDayWith(time) {
        const otherTime = new Date(time);
        if (this.time.getFullYear() == otherTime.getFullYear()) {
            if (this.time.getMonth() == otherTime.getMonth()) {
                if (this.time.getDate() == otherTime.getDate()) return true;
            }
        }
        return false;
    }
}