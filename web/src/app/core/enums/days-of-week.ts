export const WeekDays = {
    SUN: 'Sunday',
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday'
};

export const getShortDay = (weekDays: string): string => {
    return weekDays.substr(0, 3).toUpperCase();
};
