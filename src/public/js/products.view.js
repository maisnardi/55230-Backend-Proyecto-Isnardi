// const url = "localhost:8080/api/carts/:cid/product/:pid";
// const cartid = "64db9821e72e49374bae40f9";

function addProductBtt(id) {
    console.log("click")
    const data = {
        pid: id,
        cid: cartid
    }
    $.post(url, data, function (data, status) {
        console.log(`${data} and status is${status}`)
    });
}

function redirectToLogout() {
    window.location.href = "/logout";
}
function redirectToProfile() {
    window.location.href = "/profile"
}
function redirectToChatRoom() {
    window.location.href = "/chat"
}
function redirectToManager() {
    window.location.href = "/home"
}