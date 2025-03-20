export class AuthorizationDataDto {
    constructor({ client_id, client_secret, grant_type, code, redirect_uri }) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.grant_type = grant_type;
        this.code = code;
        this.redirect_uri = redirect_uri;
    }
}
