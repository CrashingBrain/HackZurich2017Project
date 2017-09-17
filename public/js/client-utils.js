function formatDate(datestring) {
  var date = new Date(datestring);

  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hours = date.getHours();
  var mins = date.getMinutes();

  return day + ' ' +
    monthNames[monthIndex] + ' ' +
    year + ' at ' +
    (hours > 9 ? hours : '0' + hours) + ':' +
    (mins > 9 ? mins : '0' + mins)
  ;
}
