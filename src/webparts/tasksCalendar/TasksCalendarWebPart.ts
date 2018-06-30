import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './TasksCalendarWebPart.module.scss';
import * as strings from 'TasksCalendarWebPartStrings';

var $: any = require('jquery');
var moment: any = require('moment');

import 'fullcalendar';

var COLORS = ['#466365', '#B49A67', '#93B7BE', '#E07A5F', '#849483', '#084C61', '#DB3A34'];

export interface ITasksCalendarWebPartProps {
  listName: string;
}

export default class TasksCalendarWebPart extends BaseClientSideWebPart<ITasksCalendarWebPartProps> {

  private displayTasks() {
    $('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
      displayEventTime: false,
      // open up the display form when a user clicks on an event
      eventClick: (calEvent, jsEvent, view) => {
        (window as any).location = this.context.pageContext.web.absoluteUrl +
          "/Lists/" + escape(this.properties.listName) + "/DispForm.aspx?ID=" + calEvent.id;
      },
      editable: false,
      timezone: "UTC",
      droppable: false, // this allows things to be dropped onto the calendar

      // put the events on the calendar 
      events: (start, end, timezone, callback) => {
        var startDate = start.format('YYYY-MM-DD');
        var endDate = end.format('YYYY-MM-DD');
        console.log(`events - start: ${start} - startDate: ${startDate} - end: ${end} - endDate: ${endDate}`);

        var restQuery = "/_api/Web/Lists/GetByTitle('" + escape(this.properties.listName) + "')/items?$select=ID,BGEventExternalVenue,BGDevelopment,BGEventStatus,BGEventStartDate,BGEventEndDate,BGEventOwner/Title&$expand=BGEventOwner&$filter=((BGEventEndDate ge '" + startDate + "' and BGEventEndDate le '" + endDate + "')or(BGEventStartDate ge '" + startDate + "' and BGEventStartDate le '" + endDate + "'))";
        console.log(this.context.pageContext.web.absoluteUrl + restQuery);
        $.ajax({
          url: this.context.pageContext.web.absoluteUrl + restQuery,
          type: "GET",
          dataType: "json",
          headers: {
            Accept: "application/json;odata=nometadata"
          }
        })
          .done((data, textStatus, jqXHR) => {
            var personColors = {};
            var colorNo = 0;

            var events = data.value.map((task) => {

              var color = COLORS[0];
              return {
                title: task.BGDevelopment,//+ " - " + assignedTo,
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

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.tasksCalendar}">
        <link type="text/css" rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.min.css" />
        <div id="calendar"></div>
      </div>`;

    //  (window as any).webAbsoluteUrl = this.context.pageContext.web.absoluteUrl;
    // require('./script');
    this.displayTasks();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
}
