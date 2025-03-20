const baseURL = "https://amocrm.shodon.ru";

const getAccessToken = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"))
        return user.access_token;
    } catch (e) {
        return false;
    }
}

const apiInstance = async (url, options = {}) => {
    const headers = { ...options.headers };
    const token = getAccessToken();
    headers["Authorization"] = `Bearer ${token}`

    const req = await fetch(`${baseURL}${url}`, {
        ...options,
        headers
    });
    if (req.status === 401) {
        localStorage.clear();
        window.location.replace("/auth.html");
    }
    return req;
}

export const api = {
    async getToken(signInDto) {
        const res = await apiInstance("/oauth2/access_token", {
            method: "POST",
            headers: {
                ["Content-Type"]: "application/json"
            },
            body: JSON.stringify(signInDto),
        })
        return res.json();
    },

    async getContact(id) {
        const contact = await apiInstance(`/api/v4/contacts/${id}`, {
            method: "GET",
        })
        return contact.json();
    },

    async getLeads(reqParams) {
        const params = new URLSearchParams(reqParams).toString();
        const leads = await apiInstance("/api/v4/leads?" + params, {
            method: "GET",
        })
        return leads.json().then(leadsRes => leadsRes._embedded.leads);
    },

    async getTasks(leadId) {
        const tasks = await apiInstance(`/api/v4/tasks?filter[entity_type][]=leads&filter[is_completed]=0&filter[entity_id][]=${leadId}&order[complete_till]=asc`);
        return await tasks.json();
    }
}
