import * as Api from '/api.js';
import {
    insertLogoutLi,
    insertMyPageLi,
    insertAdminLi,
    insertCategoryLi,
    insertProductLi,
    insertOrderLi,
} from '/home/nav.js';

const redirectHomeBtn = document.querySelector('.checkBtn');

addAllElements();

function handleHome() {
    location.href = '/';
}

async function addAllElements() {
    insertLogoutLi();
    insertMyPageLi();
    insertAdminLi();
    insertCategoryLi();
    insertProductLi();
    insertOrderLi();

    redirectHomeBtn.addEventListener('click', handleHome);
}
