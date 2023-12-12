//SuperTest User test
import * as Commander from "../../src/config/config.js"
import { expect } from "chai"
import supertest from "supertest"

const requester = supertest(`http://localhost:${Commander.ARGS.p}/api`);

describe(
    "Testing USER flow",
    function () {
        this.timeout(100000)
        let userId = null;
        let cookie = null;
        it("testing that a user registers to the application",
            async () => {
                let userData = {
                    first_name: "Test USERS first name",
                    last_name: "Test user last name",
                    email: "user@test.com",
                    age: 55,
                    password: "qwerty1234"
                }
                let response = await requester.post("/auth/register").send(userData)
                let { _body, statusCode } = response;
                userId = _body.payload._id;
                expect(statusCode).to.be.equals(201);
            }),
            it("testing a user logs in to the application",
                async () => {
                    let userLogin = {
                        email: 'user@test.com',
                        password: 'qwerty1234'
                    }
                    let response = await requester.post('/auth/login').send(userLogin)
                    let { headers } = response
                    cookie = {
                        name: headers["set-cookie"][0].split("=")[0],
                        value: headers["set-cookie"][0].split("=")[1],
                    };
                    expect(cookie.name).to.be.equals("accessToken");
                    expect(cookie.value).to.be.ok;
                }),
            it("testing change of user rol",
                async () => {
                    const newRole = {
                        role: "premium"
                    }
                    let response = await requester.put('/auth/prem').send(newRole)
                        .set("Cookie", [cookie.name + "=" + cookie.value]);
                    let { statusCode } = response;
                    expect(statusCode).to.be.equals(200);
                }),
            it("testing that a user can change his password",
                async () => {
                    const newPassword = {
                        password: "123456789",
                        confirmPassword: "123456789"
                    }
                    let response = await requester.put('/auth').send(newPassword)
                        .set("Cookie", [cookie.name + "=" + cookie.value]);
                    let { statusCode } = response;
                    expect(statusCode).to.be.equals(200);
                }),
            it("testing a user logs in to the application",
                async () => {
                    let userLogin = {
                        email: 'user@test.com',
                        password: '123456789'
                    }
                    let response = await requester.post('/auth/login').send(userLogin)
                    let { headers } = response
                    cookie = {
                        name: headers["set-cookie"][0].split("=")[0],
                        value: headers["set-cookie"][0].split("=")[1],
                    };
                    expect(cookie.name).to.be.equals("accessToken");
                    expect(cookie.value).to.be.ok;
                }),
            it("testing that a user logout from application", async () => {
                let response = await requester.post('/auth/signout')
                    .set("Cookie", [cookie.name + "=" + cookie.value]);
                let { statusCode } = response;
                expect(statusCode).to.be.equals(200);
            })
    }
)