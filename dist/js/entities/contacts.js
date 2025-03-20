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
        } catch(e) {
            return false;
        }
    }
}

export default new Contacts();
