# FullCalendar SPFx WebPart

## Summary

The WebPart uses FullCalendar to render a calendar from a SharePoint list specified via web part properties..
The SharePoint Calendar views currently render in classic mode. While the calendar view works and looks good, the user experience isn't great when some pages are based on Modern Experience and some aren't. Its fairly easy to build a custom calendar using SPFx webpart using FullCalendar which is fairly robust open source javascript calendar library. There is a [SharePoint Pnp sample](https://github.com/SharePoint/sp-dev-fx-webparts/edit/master/samples/js-modern-calendar) that features FullCalendar based SPFx webpart but since the sample targetted SPFx version 1.0, getting it to work with the recent SPFx versions (1.4.x +) would be a nightmare. Luckily there is a step by step by step guide available on [docs.microsoft.com](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/guidance/migrate-jquery-fullcalendar-script-to-spfx) using FullCalendar and I have put together this sample based on that guide. 

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp serve --nobrowser
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
