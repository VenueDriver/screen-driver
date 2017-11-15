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
1. Add tests on setting and schedule type accordance
1. Add check on weekdays coincidence between cron expressions in repeatable schedule
1. Add check for invalid cron pair in schedule
1. ~~Upgrade serverless framework version~~
1. Export DDB request parameters builder functions for create and delete requests to db helper
1. ~~Take out `dynamodb.js` and `db_helper.js` from services to `lib` folder~~

##### Web
1. Resolve warnings occurred during build process
1. Disable submit buttons when request to API is performing
1. Use two way data binding in custom components
1. Display messages when no items in a list of settings, schedule etc.
1. Unsubscribe from each subscription on component destroy
1. ~~Fix remove schedule button position for mobile devices~~
1. ~~Decrease left border of tree view for mobile devices~~
1. Fix buttons position on tree view for mobile devices
1. Get rid of deprecated `/deep/` selector
1. Get rid of checking route to display the sidebar
1. ~~Get rid of getting validation message on reset password validation~~
1. Rework all forms to use FormGroups
1. ~~An error appears in the console if try to switch to the 'schedules' tab while tree view node is in edit mode~~ 
1. Refactor tabbed switcher. Title of a tab should be received from inner tab component instead of setting it in app component
1. Rework `reset-password-form` as it used not only for password resetting

##### Kiosk
1. ~~Create in memory local storage~~
1. Use RxJS
1. Remove `cron` dependency
1. Create separate module for managing background tasks
1. Remove Pusher channel listener from `main.js`
1. Remove `Not selected` item from drop-downs
1. Add validation messages on admin panel (to describe why `Show presentation` button is disabled)
