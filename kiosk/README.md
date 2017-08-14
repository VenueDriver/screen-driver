
# ScreenDriver kiosk app

To run app for development:

1. `npm i`
1. `npm start`

To build app for Linux desktop: `npm run linux-build`

To build app for Windows desktop: `npm run win-build` or follow [this instruction](https://github.com/electron-userland/electron-packager#building-windows-apps-from-non-windows-platforms)

To create Windows installer: `npm run win-installer`. Installer will be placed in `dist` folder  

***

After installation logs will be located in `C:\Users\<user name>\AppData\Local\Programs\ScreenDriver\error.log` file. 

App's local storage will be located in `C:\Users\<user name>\AppData\Roaming\ScreenDriver\storage\` (or `~/.config/ScreenDriver/storage` for Linux). Local storage contains info about current setting of a screen.
