const categoryAddBtn = document.querySelector('#category-add-btn');
const categoryInput = document.querySelector('#category-name');
const categoryLists = document.querySelector('#category-lists');

import * as Api from '/api.js';

addAllEvents();
loadCategories();

// get
async function loadCategories() {
    const categories = await Api.get('/api/categories');

    while (categoryLists.hasChildNodes()) {
        categoryLists.removeChild(categoryLists.firstChild);
    }

    categories.map((item) => {
        const categoryName = item.name;
        const li = document.createElement('li');
        li.textContent = categoryName;

        const delBtn = document.createElement('button');
        delBtn.textContent = '삭제';

        delBtn.onclick = () => {
            if (confirm(`[${categoryName}] 해당 카테고리를 삭제하시겠습니까?`)) {
                try {
                    const result = deleteCategory(categoryName);
                } catch (err) {
                    console.error(err.stack);
                    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
                } finally {
                    loadCategories();
                }
            }
        };

        li.appendChild(delBtn);
        categoryLists.appendChild(li);
    });
}

// post
async function cretedCategory(data) {
    const created = await Api.post('/api/categories', data);
}

// delete
async function deleteCategory(data) {
    const result = await Api.delete('/api/categories', data);
    const { deletedCount } = result;
    if (deletedCount > 0) alert('삭제되었습니다');
}

function handleCreate(e) {
    e.preventDefault();

    const categoryName = categoryInput.value;
    if (categoryName.length < 1) return alert('카테고리를 입력해 주세요');

    const data = { categoryName };

    try {
        const categoryCreadted = cretedCategory(data);
    } catch (error) {
        alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${error.message}`);
    } finally {
        loadCategories();
        categoryInput.value = '';
    }
}

function addAllEvents() {
    categoryAddBtn.addEventListener('click', handleCreate);
}
