import { api } from "../api/index.js";
class Contacts {
    getContactInfo(contact) {
        try {
            const name = contact.name;
            let description = "";
            for (let field of contact.custom_fields_values) {
                if (description) {
                    description += ", "
                }
                description += `${field.field_name}: ${field.values?.[0]?.value}`;
            }
            return {
                name,
                description
            }
        } catch (e) {
            return false;
        }
    }

    async getContactsFromLead(lead) {
        const contactList = [];
        for (let contact of lead._embedded.contacts) {
            try {
                const contactRes = await api.getContact(contact.id)
                contactList.push(contactRes)
            } catch (e) {
                continue;
            }
        }
        return contactList;
    }
}

export default new Contacts();
