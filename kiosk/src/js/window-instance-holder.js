let instance = null;

class WindowInstanceHolder {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    setWindow(window) {
        this.window = window;
    }


    getWindow() {
        return this.window;
    }
}

module.exports = new WindowInstanceHolder();
