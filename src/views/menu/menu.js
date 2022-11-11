import * as Api from '/api.js';
import {
    insertLogoutLi,
    insertMyPageLi,
    insertAdminLi,
    insertCategoryLi,
    insertProductLi,
    insertOrderLi,
} from '../home/nav.js';

const menu = document.querySelector('#menu');
const productBox = document.querySelector('.product-lists');

addAllEvents();
loadMenu();
loadProducts();

function makeProduct(productAry) {
    productBox.innerHTML = '';

    if (productAry.length > 0) {
        productAry.map(({ _id: id, images, name, price }) => {
            const div = document.createElement('div');
            div.className = 'product-item';
            div.onclick = () => {
                window.location.href = `${location.protocol}//${location.host}/product/${id}`;
            };

            const img = document.createElement('img');
            img.className = 'product-image';
            img.src = `../../../${images}`;

            const deliveryText = document.createElement('span');
            deliveryText.className = 'product-delivery';
            deliveryText.textContent = '엘리스배송';
            const titleSpan = document.createElement('span');
            titleSpan.className = 'product-title';
            titleSpan.textContent = name;

            const priceDiv = document.createElement('div');
            priceDiv.className = 'product-price';

            const priceNumber = document.createElement('span');
            priceNumber.className = 'price-number';
            priceNumber.textContent = Number(price).toLocaleString('ko-KR');

            const priceUnit = document.createElement('span');
            priceUnit.className = 'price-unit';
            priceUnit.textContent = '원';

            priceNumber.appendChild(priceUnit);
            priceDiv.appendChild(priceNumber);

            div.appendChild(img);
            div.appendChild(deliveryText);
            div.appendChild(titleSpan);
            div.appendChild(priceDiv);

            productBox.appendChild(div);
        });

        return;
    }

    const li = document.createElement('li');
    li.textContent = '해당 카테고리에 상품이 없습니다.';
    productBox.appendChild(li);
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
    li.className = 'active';
    li.onclick = () => {
        loadProducts();
    };
    menu.appendChild(li);

    categories.map(({ _id: id, name }) => {
        const li = document.createElement('li');
        li.textContent = `${name}`;
        li.style.cursor = 'pointer';
        li.className = 'non-active';
        li.onclick = (e) => {
            getProductFilter(id);
            productBox.innerHTML = '';
            const li = document.createElement('li');
            li.textContent = `${id}`;
            productBox.appendChild(li);
        };
        menu.appendChild(li);
    });
}

function addAllEvents() {
    insertLogoutLi();
    insertMyPageLi();
    insertAdminLi();
    insertCategoryLi();
    insertProductLi();
    insertOrderLi();
}
