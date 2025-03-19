import {api} from "../api/index.js";
class Leads {
    constructor() {
        console.log("fsef")
        this.queue = [];
        this.isLoading = true;
        this.leads = [];
    }

    async renderLeads() { 
        const leadsDom = document.querySelector(".leads");
        if (this.isLoading) {
            if (!leadsDom.classList.contains("leads-isLoading")) {
                leadsDom.classList.add("leads-isLoading")
                const spinner = document.createElement("div")
                spinner.classList.add("loader");
                leadsDom.innerHTML = ""; 
                leadsDom.append(spinner)
            }
            return;
        } else {
            leadsDom.classList.remove("leads-isLoading")
        }
        if (this.leads.length === 0) {
            console.log("fsfesf")
            leadsDom.innerHTML = "Карточки сделок пуста. Чтобы увидеть их тут добавьте карточки из amoCRM"
            return;
        }
        leadsDom.innerHTML = "";
        for (let lead of this.leads) {
            const leadDom = document.createElement("pre")
            leadDom.classList.add("lead");
            leadDom.innerHTML += `Карточка ${JSON.stringify(lead, null, 4)}`
            leadsDom.append(leadDom)
        }
    }

     async getLeads() {
        let curPage = 1;
        const limit = 2;
        const limitMs = 10;
        
        const onFinish = () => {
            this.isLoading = false;
            this.renderLeads();
            return;
        }

        const fetchLeads = async () => {
            try {
            const leads = await api.getLeads({page: curPage, limit, with: "contacts"});
            if (leads.status !== 200) {
                throw new Error();
            } 
            const leadsData = await leads.json();
            for (let lead of leadsData._embedded.leads) {
                    lead["contacts"] ??= [];                
                    for (let contact of lead._embedded.contacts) {
                    try {
                    const contactRes = await api.getContact(contact.id)
                    lead["contacts"].push(contactRes)
                    } catch(e) {
                    console.log(e)
                    }
                }
            }
            this.leads.push(...leadsData._embedded.leads)
            curPage++;
            this.renderLeads()
            setTimeout(fetchLeads,  limitMs)
            } catch(e) {
                console.log(e)
                onFinish();
                return;
            }
        }
        setTimeout(fetchLeads, limitMs)
        this.renderLeads();
    }
}

export default new Leads();
