const url = "localhost:8080/api/carts/:cid/product/:pid";
const cartid = "64db9821e72e49374bae40f9";

function addProductBtt(id)
{
    console.log("click")
    const data={
        pid:id,
        cid:cartid
    }
    $.post(url,data, function(data, status){
        console.log(`${data} and status is${status}`)
    });
}