# EFA Slurper
Scrapes data from the German EFA service (Elektronische Fahrplanauskunft, https://www.efa.de) and displays results in a clean way. This is an attempt to compensate for the lackluster API of the service and the terrible HTML code they serve.

The main feature of this app is the ability to display a timetable for a particular station with auto reload (via Websockets), instead of visiting the website of the transportation company and refreshing manually.

I created this to always have a timetable for public transport from my home station available on a designated screen at home or at work. In addition, it’s an excellent opportunity to freshen up my JS/Node skills.

## Current status
Only the timetable feature has been implemented yet, and output formatting via CSS and custom images still needs a lot of work. The project is still far from complete and/or perfect.

### To-Do
- Custom icons
- Better styling
- Trip requests (from start to destination at specified time/date)
- More complete test coverage
- Hosting for demo
