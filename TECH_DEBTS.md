##### API
1. ~~Rework project structure (create `src` directory)~~
1. Rework priority type enum implementation
1. Write tests on removing functionality
1. Use mocks in tests
1. Export all error messages and remove them from tests
1. Refactor logic of validation
1. Add unit tests for table streams handlers 
1. Get rid of active record pattern
1. ~~Create DB helpers for update operations~~
1. ~~Create DB helpers for create operations~~
1. Create DDB parameters builder
1. Add unit tests for cron validator
1. Create separate module for cron converter
1. Refactor tests for `update_setting` function
1. Refactor conflicts identifier class

##### Web
1. Resolve warnings occurred during build process
1. Disable submit buttons when request to API is performing
1. Use two way data binding in custom components
1. Display messages when no items in a list of settings, schedule etc.
1. Fix remove schedule button position for mobile devices
1. Decrease left border of tree view for mobile devices
1. Fix buttons position on tree view for mobile devices
1. Get rid of deprecated `/deep/` selector

##### Kiosk
1. Create in memory local storage
1. Use RxJS
1. Remove `cron` dependency
1. Create separate module for managing background tasks
1. Remove Pusher channel listener from `main.js`
1. Remove `Not selected` item from drop-downs
1. Add validation messages on admin panel (to describe why `Show presentatin` button is disabled)