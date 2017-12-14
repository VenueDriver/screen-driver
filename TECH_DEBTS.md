#### API
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
1. Insert user ID or generated token to the reset password URL instead of user email

#### Web
1. Resolve warnings occurred during build process
1. Disable submit buttons when request to API is performing
1. Use two way data binding in custom components
1. Display messages when no items in a list of settings, schedule etc.
1. Unsubscribe from each subscription on component destroy
1. ~~Fix remove schedule button position for mobile devices~~
1. ~~Decrease left border of tree view for mobile devices~~
1. ~~Fix buttons position on tree view for mobile devices~~
1. Get rid of deprecated `/deep/` selector
1. Get rid of checking route to display the sidebar
1. ~~Get rid of getting validation message on reset password validation~~
1. Rework all forms to use FormGroups
1. ~~An error appears in the console if try to switch to the 'schedules' tab while tree view node is in edit mode~~ 
1. ~~Refactor tabbed switcher. Title of a tab should be received from inner tab component instead of setting it in app component~~
1. ~~Rework `reset-password-form` as it used not only for password resetting~~
1. Create directive for stopping propagation by clicking on element
1. Create first login form and reset password form instead of using universal one
1. Refactor style sheets: 
    * Use variables instead of media query screen
    * Create separate file for mixins
    * Refactor `responsive-font-size` mixin; create base one and use it for a special mixins such as `responsive-title-font-size`
    * Use mixins for responsive design (by example of `responsive-font-size` mixin)
    * Divide styles.sass into several files
1. Create sidebar component that will wrap settings manager
1. Create component for page titles
1. Fit URLs' width to device screen size

#### Kiosk
1. ~~Create in memory local storage~~
1. Use RxJS
1. Remove `cron` dependency
1. Create separate module for managing background tasks
1. ~~Remove Pusher channel listener from `main.js`~~
1. Remove `Not selected` item from drop-downs
1. Add validation messages on admin panel (to describe why `Show presentation` button is disabled)

#### Docker
1. Use existing image with DynamoDB
1. Use existing image with Serverless Framework
1. Get rid of separated files for local run and local deployment of serverless app
