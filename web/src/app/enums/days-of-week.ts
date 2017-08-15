export const DaysOfWeek = {
    SUN: 'Sunday',
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday'
};

export const getShortDay = (daysOfWeek: string): string => {
    return daysOfWeek.substr(0, 3).toUpperCase();
};