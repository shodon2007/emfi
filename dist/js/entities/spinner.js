class Spinner {
    constructor() { };
    static getHtml() {
        const spinner = document.createElement("div")
        spinner.classList.add("spinner")
        const spinnerBody = document.createElement("div")
        spinnerBody.classList.add("spinner__body");
        spinner.append(spinnerBody)
        return spinner;
    }
    static getHtmlBody() {
        const spinnerBody = document.createElement("div")
        spinnerBody.classList.add("spinner__body");
        return spinnerBody;
    }
}

export default Spinner;
