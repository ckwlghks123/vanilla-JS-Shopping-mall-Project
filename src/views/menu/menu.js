import * as Api from '/api.js';

const menu = document.querySelector('#menu');
const productLists = document.querySelector('#products-Lists');

addAllEvents();
loadMenu();
loadProducts();

function makeProduct(productAry) {
    productLists.innerHTML = '';

    if (productAry.length > 0) {
        productAry.map(({ _id: id, images, name, price }) => {
            const li = document.createElement('li');
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.flexDirection = 'column';
            div.style.cursor = 'pointer';
            div.style.width = '150px';
            div.onclick = () => {
                window.location.href = `${location.protocol}//${location.host}/product/${id}`;
            };

            const img = document.createElement('img');
            img.style.width = '150px';
            img.style.height = '150px';
            img.src = `../../../${images}`;
            const titleSpan = document.createElement('span');
            titleSpan.textContent = `상품명: ${name}`;
            const priceSpan = document.createElement('span');
            priceSpan.textContent = `가격: ${price}`;

            div.appendChild(img);
            div.appendChild(titleSpan);
            div.appendChild(priceSpan);
            li.appendChild(div);
            productLists.appendChild(li);
        });

        return;
    }

    const li = document.createElement('li');
    li.textContent = '해당 카테고리에 상품이 없습니다.';
    productLists.appendChild(li);
}

async function getProductFilter(id) {
    const products = await Api.post(`/api/menu/products/${id}`);
    makeProduct(products);
}

async function loadProducts() {
    const products = await Api.get('/api/menu/products');
    makeProduct(products);
}

async function loadMenu() {
    const categories = await Api.get('/api/menu');
    const li = document.createElement('li');
    li.textContent = `전체(${categories.length})`;
    li.style.cursor = 'pointer';
    li.onclick = () => loadProducts();
    menu.appendChild(li);

    categories.map(({ _id: id, name }) => {
        const li = document.createElement('li');
        li.textContent = `${name}`;
        li.style.cursor = 'pointer';
        li.onclick = (e) => {
            getProductFilter(id);
            productLists.innerHTML = '';
            const li = document.createElement('li');
            li.textContent = `${id}`;
            productLists.appendChild(li);
        };
        menu.appendChild(li);
    });
}

function addAllEvents() {}
