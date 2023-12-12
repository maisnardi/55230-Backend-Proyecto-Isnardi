//SuperTest Product test
import * as Commander from "../../src/config/config.js"
import { expect } from "chai"
import supertest from "supertest"

const requester = supertest(`http://localhost:${Commander.ARGS.p}/api`);

describe(
    "Testing PRODUCTS CRUD flow",
    function () {
        this.timeout(100000)
        let userId = null;
        let prodId = null;
        let cookie = null;
        it("testing that a user registers to the application",
            async () => {
                let userData = {
                    first_name: "Test PRODUCTS first name",
                    last_name: "Test products last name",
                    email: "productsuser@test.com",
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
                        email: 'productsuser@test.com',
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
            it("testing that a user can load a new product into the system",
                async () => {
                    let response = await requester.post('/products')
                        .set("Cookie", [cookie.name + "=" + cookie.value])
                        .field("title", "Supertest products title")
                        .field("description", "Supertest product description")
                        .field("price", 9999)
                        .field("code", "000-005")
                        .field("stock", 999)
                        .field("status", true)
                        .field("category", "Test")
                        .attach("photo", "./test/supertest/test.jpg")
                    let { _body, statusCode } = response;
                    prodId = _body.payload;
                    expect(statusCode).to.be.equal(201);
                    expect(_body.status).to.be.equal("success");
                }),
            it("testing that a user can read products",
                async () => {
                    let response = await requester.get('/products/').set("Cookie", [cookie.name + "=" + cookie.value])
                    let { _body } = response
                    expect(_body.message).to.be.equals('products found');
                }),
            it("testing that a user can read one product",
                async() => {
                    let response = await requester.get('/products/' + prodId)
                    .set("Cookie", [cookie.name + "=" + cookie.value])
                    let { _body, statusCode } = response
                    expect(_body).to.be.an("object");
                    expect(statusCode).to.be.equal(200);
            })
            it("testing that a user can update a product",
                async () => {
                    let response = await requester.put('/products/' + prodId)
                        .set("Cookie", [cookie.name + "=" + cookie.value])
                        .field("title", "Title was modified")
                        .attach("photo", "./test/supertest/test2.jpg")
                    let { _body, statusCode } = response;
                    expect(statusCode).to.be.equal(200);
                    expect(_body.update).to.be.equal(true);
                }),
            it("testing that a user can delete a product from the system",
                async () => {
                    let response = await requester.delete('/products/' + prodId).set("Cookie", [cookie.name + "=" + cookie.value])
                    let { _body, statusCode } = response;
                    expect(statusCode).to.be.equal(200);
                    expect(_body.deleted).to.be.equal(true);
                })
    }
)