class Modal {
    constructor() {
        this._isLoading = false;
        this._isOpen = false;
        this.modalDom = document.createElement("div")
        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content")
        this.modalDom.classList.add("modal");
    }
    setIsLoading(isLoading) {
        this._isLoading = isLoading;
    }
    open() {}
    close() {}
}
