// 计算孕周
export function calcPregnancyWeeks(startDate) {
    let weeks = 0, day = 0;
    if (!startDate) return {weeks, day}

    // 向下取整，是因为不超过24小时，不能算多一天
    let days = Math.floor((Date.now() - new Date(startDate)) / 1000/3600/24);
    if (days <= 0) return {weeks, day}

    weeks = Math.floor(days / 7); // 周数：取整数部分
    day = days % 7; // 天数：取余数

    return {weeks, day}
}