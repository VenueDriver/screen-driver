export const DaysOfWeek = {
    SUN: 'Sunday',
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday'
};

export const getShortDay = (dayOfWeek: string): string => {
    return dayOfWeek.substr(0, 3).toUpperCase();
};