let instance = null;

class WindowInstanceHolder {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    setWindow(window) {
        this.closeWindow();
        this.window = window;
    }


    getWindow() {
        return this.window;
    }

    closeWindow() {
        if (this.window)
            this.window.close()
    }
}

module.exports = new WindowInstanceHolder();
