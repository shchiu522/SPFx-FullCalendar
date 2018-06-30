import moment from 'moment';


var TASK_LIST = "Sales%20Events";
var PATH_TO_DISPFORM = window.webAbsoluteUrl + "/Lists/" + TASK_LIST + "/DispForm.aspx";
var COLORS = ['#466365', '#B49A67', '#93B7BE', '#E07A5F', '#849483', '#084C61', '#DB3A34'];

displayTasks();

function displayTasks() {
  $('#calendar').fullCalendar('destroy');
  $('#calendar').fullCalendar({
    //weekends: false,
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,basicWeek,basicDay'
    },
    displayEventTime: false,
    // open up the display form when a user clicks on an event
    eventClick: function (calEvent, jsEvent, view) {
      window.location = PATH_TO_DISPFORM + "?ID=" + calEvent.id;
    },
    editable: false,
    timezone: "UTC",
    droppable: false, // this allows things to be dropped onto the calendar
    // update the end date when a user drags and drops an event 
    // eventDrop: function (event, delta, revertFunc) {
    //   updateTask(event.id, event.start, event.end);
    // },
    // put the events on the calendar 
    events: function (start, end, timezone, callback) {
      var startDate = start.format('YYYY-MM-DD');
      var endDate = end.format('YYYY-MM-DD');
      console.log(`events - start: ${start} - startDate: ${startDate} - end: ${end} - endDate: ${endDate}`);

      var restQuery = "/_api/Web/Lists/GetByTitle('" + TASK_LIST + "')/items?$select=ID,BGEventExternalVenue,BGDevelopment,\
    BGEventStatus,BGEventStartDate,BGEventEndDate,BGEventOwner/Title&$expand=BGEventOwner&\
$filter=((BGEventEndDate ge '" + startDate + "' and BGEventEndDate le '" + endDate + "')or(BGEventStartDate ge '" + startDate + "' and BGEventStartDate le '" + endDate + "'))";
      console.log(window.webAbsoluteUrl + restQuery);

      $.ajax({
          url: window.webAbsoluteUrl + restQuery,
          type: "GET",
          dataType: "json",
          headers: {
            Accept: "application/json;odata=nometadata"
          }
        })
        .done(function (data, textStatus, jqXHR) {
          var personColors = {};
          var colorNo = 0;

          var events = data.value.map(function (task) {
            // var assignedTo = task.AssignedTo.map(function (person) {
            //   return person.Title;
            // }).join(', ');
            var color = COLORS[0];

            // var color = personColors[assignedTo];
            // if (!color) {
            //   color = COLORS[colorNo++];
            //   personColors[assignedTo] = color;
            // }
            // if (colorNo >= COLORS.length) {
            //   colorNo = 0;
            // }
            return {
              // title: task.Title + " - " + assignedTo,
              title: task.BGDevelopment, //+ " - " + assignedTo,
              id: task.ID,
              color: color, // specify the background color and border color can also create a class and use className parameter. 
              start: moment.utc(task.BGEventStartDate).add("1", "days"),
              end: moment.utc(task.BGEventEndDate).add("1", "days") // add one day to end date so that calendar properly shows event ending on that day
            };
          });
          console.log(events);
          callback(events);
        });
    }
  });
}

// function updateTask(id, startDate, dueDate) {
// // subtract the previously added day to the date to store correct date
// var sDate = moment.utc(startDate).add("-1", "days").format('YYYY-MM-DD') + "T" +
//   startDate.format("hh:mm") + ":00Z";
// if (!dueDate) {
//   dueDate = startDate;
// }
// var dDate = moment.utc(dueDate).add("-1", "days").format('YYYY-MM-DD') + "T" +
//   dueDate.format("hh:mm") + ":00Z";

// $.ajax({
//   url: window.webAbsoluteUrl + '/_api/contextinfo',
//   type: 'POST',
//   headers: {
//     'Accept': 'application/json;odata=nometadata'
//   }
// })
//   .then(function (data, textStatus, jqXHR) {
//     return $.ajax({
//       url: window.webAbsoluteUrl +
//       "/_api/Web/Lists/getByTitle('" + TASK_LIST + "')/Items(" + id + ")",
//       type: 'POST',
//       data: JSON.stringify({
//         StartDate: sDate,
//         DueDate: dDate,
//       }),
//       headers: {
//         Accept: "application/json;odata=nometadata",
//         "Content-Type": "application/json;odata=nometadata",
//         "X-RequestDigest": data.FormDigestValue,
//         "IF-MATCH": "*",
//         "X-Http-Method": "PATCH"
//       }
//     });
//   })
//   .done(function (data, textStatus, jqXHR) {
//     alert("Update Successful");
//   })
//   .fail(function (jqXHR, textStatus, errorThrown) {
//     alert("Update Failed");
//   })
//   .always(function () {
//     displayTasks();
//   });
// }
