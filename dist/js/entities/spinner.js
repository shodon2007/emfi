class Spinner {
    constructor() {};
    static getHtml() {
        const spinner = document.createElement("div")
        spinner.classList.add("spinner")
        const spinnerBody = document.createElement("div")
        spinnerBody.classList.add("spinner__body");
        spinner.append(spinnerBody)
            return spinner;
    }
}

export default Spinner;
