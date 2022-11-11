/**
 * @detail: 지금까지 작성된 코드는 nav와 관련된 코드로, 다른 페이지에서도 현재 js 파일과
 * home.html파일의 navbar 부분이 사용될 수 있습니다.
 * @editor: 김상현
 * @date: 2022-11-05
 */

import * as Api from '/api.js';
import {
    insertLogoutLi,
    insertMyPageLi,
    insertAdminLi,
    insertCategoryLi,
    insertProductLi,
    insertOrderLi,
} from './nav.js';

const productBox = document.querySelector('.product-lists');

addAllElements();
loadProducts();

async function loadProducts() {
    const products = await Api.get('/api/products');

    products.map(({ _id: id, name, price, images }) => {
        const itemBox = document.createElement('div');
        itemBox.className = 'product-item';
        itemBox.onclick = () => (location.href = `/product/${id}`);

        const img = document.createElement('img');
        img.className = 'product-image';
        img.src = `../../../${images[0]}`;

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

        itemBox.appendChild(img);
        itemBox.appendChild(deliveryText);
        itemBox.appendChild(titleSpan);
        itemBox.appendChild(priceDiv);

        productBox.appendChild(itemBox);
    });
}

const promotionSwiper = new Swiper('.promotion .swiper-container', {
    slidesPerView: 2,
    spaceBetween: 10,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 3000,
    },
    breakpoints: {
        1300: {
            slidesPerView: 4,
            spaceBetween: 10,
        },
    },
});

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
    insertLogoutLi();
    insertMyPageLi();
    insertAdminLi();
    insertCategoryLi();
    insertProductLi();
    insertOrderLi();
}
