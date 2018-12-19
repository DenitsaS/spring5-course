
export default class TabList {
    constructor() {
        this.array = new Array();
        this.curr = null;
    }
    add(value) {
        if (this.curr) {
            this.array.push(value);
        } else {
            this.array.push(value);
            this.curr = 0;
        }
    };
    unshift(value) {
        if (this.curr) {
            this.array.unshift(value);
        } else {
            this.array.unshift(value);
            this.curr = 0;
        }
    };
    next() {
        if (this.curr != null) {
            if (this.curr == this.array.length - 1) {
                this.curr = 0;
            } else
                this.curr = this.curr + 1;
        }
        return this.array[this.curr];
    };
    prev() {
        if (this.curr != null) {
            if (this.curr - 1 == -1) {
                this.curr = this.array.length - 1;
            } else
                this.curr = this.curr - 1;
        }
        return this.array[this.curr];
    }
    getCurrentTab() {
        return this.array[this.curr];
    }
    setCurrentTab(tab) {
        this.curr = this.array.indexOf(tab);
    }
}