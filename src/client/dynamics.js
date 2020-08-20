import request from "superagent";

export const DYNAMICS_URI = "https://ezauditfsc.api.crm.dynamics.com/api/data/v9.1"

let expires_on = null;
let token = null;

/**
 * Requests an access token from server and handles caching. **Must be called on each access token use.**
 * @returns {Promise<string>} Returns a promise to token string.
 */
export async function getToken() {
    try {
        if (expires_on === null || Date.now() - expires_on < 60) {
            const {body} = await request(
                "POST",
                "https://login.microsoftonline.com/1af2bd66-4c24-44a4-8624-f46220d13570/oauth2/token")
                .type("form")
                .send({
                    resource: "https://ezauditfsc.crm.dynamics.com",
                    client_id: "6b76c33c-0827-42dc-be63-840b60853e6e",
                    grant_type: "Password",
                    username: "client.user@ezauditfsc.onmicrosoft.com",
                    Password: "Tejz3hTqTpC9f9",
                    client_secret: "IZxfP-~Ei.04w2.Js_4MhG5-Tqrw435~cF"
                })
            expires_on = body.expires_on;
            token = body.access_token;
        }
        return token;
    } catch (e) {
        console.error(e);
    }
}

export async function get(uri) {
    try {
        const {body} = await request("GET", DYNAMICS_URI + uri)
            .set("Authorization", await getToken())
        return body.value;
    } catch (e) {
        console.error(e);
    }
}