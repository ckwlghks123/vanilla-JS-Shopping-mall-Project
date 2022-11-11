import * as Api from '/api.js';
import {
    insertLogoutLi,
    insertMyPageLi,
    insertAdminLi,
    insertCategoryLi,
    insertProductLi,
    insertOrderLi,
} from '../home/nav.js';

const productNameInput = document.querySelector('#product-name');
const productPriceInput = document.querySelector('#product-price');
const productSelCtg = document.querySelector('#product-category');
const productDesInput = document.querySelector('#product-description');
const productImgInput = document.querySelector('#product-image');
const productCreateBtn = document.querySelector('#product-create-btn');
const productLists = document.querySelector('#product-lists');
const uploadName = document.querySelector('#upload-name');

addAllEvents();
loadCategory();
loadProduct();

let file;
let categoryDump;

// get categories
async function loadCategory(data) {
    const categories = await Api.get('/api/categories');
    categoryDump = [];
    categories.map((item) => {
        const categoryName = item.name;
        const option = document.createElement('option');
        categoryDump.push(item.name);
        option.value = item.name;
        option.textContent = item.name;
        productSelCtg.appendChild(option);
    });
}

// delete product
async function deleteProduct(id) {
    const result = await Api.delete(`/api/products/${id}`);
    if (result === 'delete') {
        alert('삭제되었습니다');
        location.reload();
    }
}

// get products
async function loadProduct() {
    const products = await Api.get('/api/products');

    products.map(
        (
            {
                _id: productId,
                name,
                price,
                description,
                images,
                category: { _id: ctgId, name: categoryName },
            },
            idx
        ) => {
            const li = document.createElement('li');
            const form = document.createElement('form');
            form.className = 'li-form';
            form.style.display = 'flex';
            form.style.flexDirection = 'column';
            form.style.width = '300px';

            const hiddenProductId = document.createElement('input');
            hiddenProductId.type = 'hidden';
            hiddenProductId.value = productId;

            const img = document.createElement('img');
            img.width = '150';
            img.height = '150';
            img.src = `../../../${images}`;

            const hiddenCtgId = document.createElement('input');
            hiddenCtgId.type = 'hidden';
            hiddenCtgId.value = ctgId;

            const titleLabel = document.createElement('label');
            titleLabel.htmlFor = 'product-title';
            titleLabel.textContent = '상품명';
            const titleInput = document.createElement('input');
            titleInput.value = name;

            const ctgLabel = document.createElement('label');
            ctgLabel.htmlFor = 'product-category';
            ctgLabel.textContent = '카테고리';
            const ctgSelect = document.createElement('select');

            for (let category of categoryDump) {
                const ctgOption = document.createElement('option');
                ctgOption.value = category;
                ctgOption.textContent = category;
                ctgSelect.appendChild(ctgOption);
            }
            ctgSelect.value = categoryName;

            const priceLabel = document.createElement('label');
            priceLabel.htmlFor = 'product-price';
            priceLabel.textContent = '가격';
            const priceInput = document.createElement('input');
            priceInput.value = price;

            const desLabel = document.createElement('label');
            desLabel.htmlFor = 'product-des';
            desLabel.textContent = '설명';
            const desInput = document.createElement('textarea');
            desInput.value = description;

            const imgInputLabel = document.createElement('label');
            imgInputLabel.htmlFor = 'product-img';
            imgInputLabel.textContent =
                '사진 등록시 기존 사진은 삭제됩니다.\n사진을 등록하지 않을시 기존 사진으로 유지됩니다.';

            const liUploadName = document.createElement('input');
            liUploadName.id = 'li-upload-name';
            liUploadName.value = '첨부파일';
            liUploadName.placeholder = '첨부파일';
            liUploadName.dataset.idx = idx;

            const liProductLabel = document.createElement('label');
            liProductLabel.id = 'li-product-image-label';
            liProductLabel.htmlFor = `li-product-image${idx.toString()}`;
            liProductLabel.className = 'li-product-image-label';
            liProductLabel.innerHTML = '<span>추가</span>';

            const imgInput = document.createElement('input');
            imgInput.type = 'file';
            imgInput.id = `li-product-image${idx.toString()}`;
            imgInput.className = 'li-product-image';
            let productFile;
            imgInput.addEventListener('change', (e) => {
                e.preventDefault();
                const fileName = imgInput.value;
                liUploadName.value = fileName;
                productFile = e.target.files[0];
            });

            const liFileBox = document.createElement('div');
            liFileBox.id = 'li-file-box';
            liFileBox.appendChild(liUploadName);
            liFileBox.appendChild(liProductLabel);
            liFileBox.appendChild(imgInput);

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-button';
            editBtn.textContent = '수정';
            editBtn.onclick = (e) => {
                e.preventDefault();

                if (confirm('수정하시겠습니까?')) {
                    try {
                        const formData = new FormData();
                        if (imgInput.value) formData.append('image', productFile);
                        formData.append('category', ctgSelect.value);
                        formData.append('name', titleInput.value);
                        formData.append('price', priceInput.value);
                        formData.append('description', desInput.value);

                        async function sendEditFormData() {
                            const options = {
                                method: 'PATCH',
                                body: formData,
                            };

                            await fetch(
                                `${location.protocol}//${location.host}/api/products/${productId}`,
                                options
                            ).then((res) => {
                                if (res.ok) {
                                    alert('상품이 수정되었습니다');
                                    location.reload();
                                }
                            });
                        }

                        sendEditFormData();
                    } catch (error) {
                        console.error(err.stack);
                        alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
                    }
                }
            };
            const delBtn = document.createElement('button');
            delBtn.textContent = '삭제';
            delBtn.className = 'del-button';
            delBtn.onclick = (e) => {
                e.preventDefault();

                if (confirm(`[${name}] 해당 상품을 삭제하시겠습니까?`)) {
                    try {
                        deleteProduct(productId);
                    } catch (error) {
                        console.error(err.stack);
                        alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
                    }
                }
            };

            form.appendChild(img);
            form.appendChild(titleLabel);
            form.appendChild(titleInput);
            form.appendChild(ctgLabel);
            form.appendChild(ctgSelect);
            form.appendChild(priceLabel);
            form.appendChild(priceInput);
            form.appendChild(desLabel);
            form.appendChild(desInput);
            form.appendChild(imgInputLabel);
            form.appendChild(liFileBox);
            form.appendChild(editBtn);
            form.appendChild(delBtn);
            li.appendChild(form);
            productLists.appendChild(li);
        }
    );
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

        await fetch(`${location.protocol}//${location.host}/api/products`, options).then((res) => {
            if (res.ok) {
                alert('상품이 생성되었습니다');
                location.reload();
            }
        });
    }

    sendFormData();
}

function addAllEvents() {
    insertLogoutLi();
    insertMyPageLi();
    insertAdminLi();
    insertCategoryLi();
    insertProductLi();
    insertOrderLi();
    productImgInput.addEventListener('change', handleImage);
    productCreateBtn.addEventListener('click', handleCreate);
    productImgInput.addEventListener('change', () => {
        const fileName = productImgInput.value;
        uploadName.value = fileName;
    });
}
