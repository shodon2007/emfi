import {getUserFromStorage} from "./utils/getUserFromStorage.js"
import leads from "./entities/leads.js";

function verifyUser() {
    const {data: userData, status} = getUserFromStorage()
    if (status !== "ok" || !("access_token" in userData)) {
        localStorage.clear();
        window.location.replace("/auth.html");
    }
}
const leadList = [];

async function start() {
    verifyUser();
    leads.getLeads();
}

start();
