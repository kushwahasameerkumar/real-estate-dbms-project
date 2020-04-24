const asyncForEach = async (array, callback) =>  {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
};

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

module.exports = {
  asyncForEach: asyncForEach,
  formatDate: formatDate
};