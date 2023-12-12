let { search } = window.location;
let sort;
let limit;
let stock;
let path;
let category;

const querystring = window.location.search;
const params = new URLSearchParams(querystring);

const limitSelect = document.getElementById('productsPerPage');
limitSelect.addEventListener('change', (e) => {
    limit=e.target.value;
    params.has('limit') ? params.set('limit', limit) : params.append('limit', limit);
    window.location.href =`/products?${params}`
})

//window.location.href = `/products?limit=${e.target.value}`
const sortSelect = document.getElementById("orderByPrice")
sortSelect.addEventListener('change', (e)=>{
    sort=e.target.value;
    params.has('sort') ? params.set('sort', sort) : params.append('sort', sort);
    window.location.href =`/products?${params}`
})

const stockSelect = document.getElementById("filterByStock")
stockSelect.addEventListener('change', (e)=>{
    stock=e.target.value;
    params.has('stock') ? params.set('stock', stock) : params.append('stock', stock);
    window.location.href =`/products?${params}`
})


let categoryButton = document.getElementsByName('category');
    for (i = 0; i < categoryButton.length; i++) {
        categoryButton[i].addEventListener('change',(e)=>{
            category = e.target.value;
            params.has('category') ? params.set('category', category) : params.append('category', category);
            window.location.href =`/products?${params}`
        })
    }



