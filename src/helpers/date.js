export const formatDate = (date) =>
    `${date.getFullYear()}-${'0' + (+date.getMonth() + 1)}-${date.getDate()}`;

export const getDateList = (content) => {
    const dates = content.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);
    if (!dates) return '';

    return dates.join(', ');
};
