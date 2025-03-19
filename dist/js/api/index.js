const baseURL = "https://amocrm.shodon.ru";

const getAccessToken = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"))
            return user.access_token;
    } catch(e) {
        return false;
    }
}

const apiInstance = (url, options = {}) => {
    const headers = {...options.headers};
    const token = getAccessToken();
    headers["Authorization"] = `Bearer ${token}`

    return  fetch(`${baseURL}${url}`, {
        ...options,
        headers     
        });
}

export const api = {
    async getToken(signInDto){
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
    console.log(id);
        const contact = await apiInstance(`/api/v4/contacts/${id}`, {
            method: "GET",
        })
        return contact.json();
    },

    async getLeads(reqParams)  {
        const params = new URLSearchParams(reqParams).toString();
        const leads = await apiInstance("/api/v4/leads?" + params, {
            method: "GET",
        })
        return leads;
    }
}
