import { api } from "../api/index.js";
import Spinner from "./spinner.js"
import contacts from "./contacts.js"
import { CustomDate } from "./date.js";
import task from "./task.js";

class Leads {
    constructor() {
        this.isLoading = true;
        this.leads = [];
        this.leadsSpinner = Spinner.getHtml();
        this.leadIsLoading = false;
        this.openLeadId = null;
        this.openLeadInfoDom = null;
        this.leadSpinner = null;
    }
    getLeadDom(id) {
        return document.getElementById(`lead-${id}`)
    }
    async closeAllLeads() {
        if (this.leadSpinner) {
            this.leadSpinner.remove();
        }
        this.openLeadInfoDom?.remove();

        const leads = document.querySelector(".leads");
        for (let lead of leads.children) {
            if (lead) {
                lead.classList.remove("loading");
                lead.classList.remove("open");
            }
        }
        this.openLeadId = null;
        this.leadIsLoading = false;
    }

    async leadClick(lead) {
        const isCurrentLeadAlreadyOpened = lead.id === this.openLeadId;
        if (isCurrentLeadAlreadyOpened) {
            await this.closeAllLeads(lead);
            return;
        }

        const leadDom = this.getLeadDom(lead.id);
        await this.closeAllLeads();
        this.leadIsLoading = true;
        this.openLeadId = lead.id;
        leadDom.classList.add("loading");
        if (this.leadSpinner) {
            this.leadSpinner.remove();
        }
        this.leadSpinner = Spinner.getHtmlBody();
        leadDom.append(this.leadSpinner);
        this.leadIsLoading = false;
        const taskStatus = await task.getTaskStatus(lead);
        leadDom.classList.remove("loading");
        if (lead.id === this.openLeadId) {
            leadDom.classList.add("open")
            this.openLeadInfoDom?.remove();
            this.openLeadInfoDom = document.createElement("div");
            const taskStatusHtml = task.getTaskStatusHTML(taskStatus);
            const leadCreateDate = CustomDate.getFormatDate(new Date(lead.created_at * 1000));
            this.openLeadInfoDom.innerHTML = `
                <div>Дата создания сделки: ${leadCreateDate}</div>
                <div>
                        ${taskStatusHtml}
                </div>
                `;
            this.leadSpinner.remove();
            leadDom.append(this.openLeadInfoDom)
        }
    }

    async updateLeadsLoading() {
        const leadsDom = document.querySelector(".leads");
        if (this.isLoading) {
            if (!leadsDom.classList.contains("leads-isLoading")) {
                leadsDom.classList.add("leads-isLoading")
                leadsDom.append(this.leadsSpinner);
            }
            return;
        } else {
            leadsDom.classList.remove("leads-isLoading")
            this.leadsSpinner.remove();
        }

    }

    async renderEmptyLeads() {
        const leadsDom = document.querySelector(".leads");
        leadsDom.innerHTML = "Карточки сделок пуста. Чтобы увидеть их тут добавьте карточки из amoCRM"
    }

    async renderLeadList() {
        const leadsList = document.querySelector(".leads");

        for (let lead of this.leads) {
            const leadMain = document.createElement("div")
            const leadBrief = document.createElement("div");

            leadBrief.classList.add("lead__brief")
            leadMain.classList.add("lead");
            leadMain.setAttribute("id", `lead-${lead.id}`)
            leadMain.addEventListener("click", () => {
                this.leadClick(lead)
            })

            const columns = [
                `id сделки: ${lead.id}`,
                `Название сделки:${lead.name}`,
                `Бюджет: ${lead.price}`,
                null,
                null
            ];

            for (let contact of lead.contacts) {
                const contactInfo = contacts.getContactInfo(contact);
                if (contactInfo === false) {
                    continue;
                }
                columns[3] = `Название контакта: ${contactInfo.name}`;
                columns[4] = contactInfo.description;
            }
            for (let column of columns) {
                const leadRow = document.createElement("div")
                leadRow.innerHTML = column;
                leadBrief.append(leadRow)
            }

            leadMain.append(leadBrief)
            leadsList.append(leadMain);
        }
    }

    async renderPage() {
        this.updateLeadsLoading();
        const isLeadsLoading = this.isLoading;
        if (isLeadsLoading) {
            return;
        }

        const isLeadsEmpty = this.leads.length === 0;
        if (isLeadsEmpty) {
            return this.renderEmptyLeads();
        }

        this.renderLeadList();
    }

    async getLeads() {
        let curPage = 1;
        const limit = 2;
        const limitMs = 10;
        const onFinish = () => {
            this.isLoading = false;
            this.renderPage();
            return;
        }

        this.isLoading = true;
        this.renderPage();
        this.leads = [];

        const fetchLeads = async () => {
            try {
                const chunkLeads = await api.getLeads({
                    page: curPage, limit, with: "contacts"
                });
                for (let lead of chunkLeads) {
                    lead["contacts"] = await contacts.getContactsFromLead(lead);
                }
                this.leads.push(...chunkLeads)
                curPage++;
                setTimeout(fetchLeads, limitMs)
            } catch (e) {
                onFinish();
                return;
            }
        }
        setTimeout(fetchLeads, limitMs)
    }
}

export default new Leads();

