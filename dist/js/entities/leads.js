import {api} from "../api/index.js";
import Spinner from "./spinner.js"
import contacts from "./contacts.js"
class Leads {
    constructor() {
        console.log("fsef")
        this.queue = [];
        this.isLoading = true;
        this.leads = [];
        this.leadsSpinner = Spinner.getHtml();
        this.openLead = -1;
        this.openLeadLoading = false;
        this.openLeadInfo = null;
        this.openLeadModalDom = null;
    }

    async closeModal() {
        if (this.isLoading) {
            const waitHandler = new Promise((res) => {
                setTimeout(() => {res(true)}, 1000)
            })
            await waitHandler;
        }
        this.openLeadModalDom.remove();
        this.openLeadModalDom = null;
        const body = document.querySelector("body")
        body.classList.remove("open-modal")
    }

    async openLeadModal() {
        const modal = document.createElement("div");
        modal.addEventListener("click", () => {
            this.closeModal();
        })
        const modalContent = document.createElement("div")
        modalContent.addEventListener("click", (e) => {
            e.stopPropagation();
        })
        modalContent.classList.add("modal-content")
        modal.append(modalContent);
        if (this.openLeadLoading === true) {
            modal.classList.add("loading")
        }
        const body = document.querySelector("body")
            if (body.classList.contains("open-modal")) {
                return;
            } else {
                this.openLeadModalDom = modal;
                modal.classList.add("modal")
                body.classList.add("open-modal")
                body.append(modal);
            }
    }

    async leadClick(lead) {
        this.openLead = lead.id;
        this.openLeadLoading = true;
        this.openLeadModal();
        const fieldValues = await api.getLead(lead.id);
        this.openLeadLoading = false;
        this.openLeadModalDom.classList.remove("loading")
    }

    async renderLeads() { 
        const leadsDom = document.querySelector(".leads");
        const leadsBody = document.querySelector(".leads__body")
        if (this.isLoading) {
            if (!leadsDom.classList.contains("leads-isLoading")) {
                leadsDom.classList.add("leads-isLoading")
                leadsDom.append(this.leadsSpinner); 
            }
            return;
        } else {
            leadsDom.classList.remove("leads-isLoading")
            this.leadsSpinner.remove();
             // leadsDom.remove(this.leadsSpinner); 
        }
        if (this.leads.length === 0) {
            leadsBody.innerHTML = "Карточки сделок пуста. Чтобы увидеть их тут добавьте карточки из amoCRM"
            return;
        }
        for (let lead of this.leads) {
            const leadCol = document.createElement("tr");
            leadCol.addEventListener("click", () => {
                this.leadClick(lead)
            })
            const fields = [lead.id, lead.name, lead.price,null, null];
            for (let contact of lead.contacts) {
                const contactInfo = contacts.getContactInfo(contact);
                if (contactInfo === false) {
                    continue;
                }
                fields[3] = contactInfo.name;
                fields[4] = contactInfo.description;
            }
            for (let field of fields) {
                const td = document.createElement("td")
                td.innerHTML = field;
                leadCol.append(td)
            }
            leadsBody.append(leadCol); 
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
