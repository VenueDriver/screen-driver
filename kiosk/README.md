
# ScreenDriver kiosk app

### Setup
Before run the app for development perform the following set of commands (for Linux):

1. `apt-get update`
1. `apt-get -y install libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1`
1. `npm i -g electron`

### Run project 

To run app for development perform:
 
1. `npm i`
1. `npm start`

### Build project

To build app for Linux desktop: `npm run linux-build`

To build app for Windows desktop: `npm run win-build` or follow [this instruction](https://github.com/electron-userland/electron-packager#building-windows-apps-from-non-windows-platforms)

To create Windows installer: `npm run win-installer`. Installer will be placed in `dist` folder  

> After installation logs will be located in `C:\Users\<user name>\AppData\Local\Programs\ScreenDriver\error.log` file. 
>
> App's local storage will be located in `C:\Users\<user name>\AppData\Roaming\ScreenDriver\storage\` (or `~/.config/ScreenDriver/storage` for Linux). Local storage contains info about current setting of a screen.
