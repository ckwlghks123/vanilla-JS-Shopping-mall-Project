const productNameInput = document.querySelector('#product-name');
const productPriceInput = document.querySelector('#product-price');
const productSelCtg = document.querySelector('#product-category');
const productDesInput = document.querySelector('#product-description');
const productImgInput = document.querySelector('#product-image');
const productCreateBtn = document.querySelector('#product-create-btn');
const fileRestBtn = document.querySelector('#file-reset-btn');

import * as Api from '/api.js';

addAllEvents();
loadCategory();

let file;

// get categories
async function loadCategory(data) {
    const categories = await Api.get('/api/categories');

    categories.map((item) => {
        const categoryName = item.name;
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = item.name;
        productSelCtg.appendChild(option);
    });
}

function handleImage(e) {
    file = e.target.files[0];
}

function handleCreate(e) {
    e.preventDefault();
    if (
        !productNameInput.value ||
        !productPriceInput.value ||
        productSelCtg.value === 'none' ||
        !productDesInput.value ||
        !productImgInput.value
    )
        return alert('상품 값을 입력해주세요');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', productNameInput.value);
    formData.append('category', productSelCtg.value);
    formData.append('price', productPriceInput.value);
    formData.append('description', productDesInput.value);

    async function sendFormData() {
        const options = {
            method: 'POST',
            body: formData,
        };

        await fetch('http://localhost:8080/api/products', options).then((res) => {
            if (res.ok) {
                alert('상품이 생성되었습니다');
                location.reload();
            }
        });
    }

    sendFormData();
}

function addAllEvents() {
    productImgInput.addEventListener('change', handleImage);
    productCreateBtn.addEventListener('click', handleCreate);
    fileRestBtn.addEventListener('click', (e) => {
        e.preventDefault();
        productImgInput.value = '';
    });
}
