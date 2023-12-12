//SuperTest Payment test
import * as Commander from "../../src/config/config.js"
import { expect } from "chai"
import _ from "mongoose-paginate-v2";
import supertest from "supertest"

const requester = supertest(`http://localhost:${Commander.ARGS.p}/api`);

describe(
    "Testing PAYMENT flow",
    function () {
        this.timeout(100000)
        let userId = null;
        let cartId = null;
        let cookie = null;
        it("testing that a user registers to the application",
            async () => {
                let userData = {
                    first_name: "Test PAYMENT first name",
                    last_name: "Test payment last name",
                    email: "paymentuser@test.com",
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
                        email: 'paymentuser@test.com',
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
            it("testing a user can add a product to a cart", async () => {
                let response = await requester.put('/carts/64c3cc0d06404a4aff717824')
                    .set("Cookie", [cookie.name + "=" + cookie.value])
                let { _body, statusCode } = response;
                expect(_body.updated).to.be.equals(true);
                expect(statusCode).to.be.equals(200);
            }),
            it("testing a user can generate a ticket", async () => {
                let response = await requester.post('/tickets')
                    .set("Cookie", [cookie.name + "=" + cookie.value])
                let { _body, statusCode } = response;
                expect(_body).to.be.an("object");
                expect(statusCode).to.be.equals(201);
            }),
            it("testing a user can generate a payment intent", async () => {

                const testProduct = {
                    title: "Test payment title",
                    quantity: 1,
                    price: 9999,
                }

                let response = await requester.post('/payments/intents').send(testProduct)
                    .set("Cookie", [cookie.name + "=" + cookie.value])
                let { _body, statusCode } = response;
                expect(statusCode).to.be.equals(200);
                expect(_body).to.be.an("object");
                expect(_body).to.have.property("id");
            })
    }
)