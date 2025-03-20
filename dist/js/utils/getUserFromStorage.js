export function getUserFromStorage() {
    try {
        const userData = JSON.parse(localStorage.getItem("user"));
        return { status: "ok", data: userData }
    } catch (e) {
        return {
            status: "fail",
        }
    }
}
