import * as Api from "/api.js";

const productFrame = document.querySelector("#product-frame");
const productImg = document.querySelector("#product-image");
const productCtg = document.querySelector("#ctg");
const productTitle = document.querySelector("#title");
const productPrice = document.querySelector("#price");
const productDes = document.querySelector("#description");
const productId = location.href.split("/")[4];
const minusBtn = document.querySelector("#minusBtn");
const plusBtn = document.querySelector("#plusBtn");
const amount = document.querySelector("#amountInput");
const cartBtn = document.querySelector("#pushCart");

addAllEvents();
loadProduct(productId);

async function loadProduct(productId) {
    const product = await Api.post(`/api/productdetail/${productId}`);
    const { _id: id, name, price, categoryName, description, images } = product;

    productImg.src = `../../../${images}`;
    productCtg.textContent = categoryName;
    productTitle.textContent = name;
    productPrice.textContent = price;
    productDes.textContent = description;
}

function handleMinus() {
    let curAmount = +amount.value;
    curAmount -= 1;
    if (curAmount < 1) return alert("수량은 최소 1개가 필요합니다");
    amount.value = curAmount;
}

function handlePlus() {
    let curAmount = +amount.value;
    curAmount += 1;
    amount.value = curAmount;
}

// create cart
async function handleCart() {
    if (confirm("장바구니에 추가하시겠습니까?")) {
        const cartInfo = {
            product: productId,
            amount: +amount.value,
        };

        const createdCart = await Api.post(`/api/productdetail`, cartInfo);
        if (createdCart === "success") return alert("장바구니에 추가되었습니다");
    }
}

function addAllEvents() {
    minusBtn.addEventListener("click", handleMinus);
    plusBtn.addEventListener("click", handlePlus);
    cartBtn.addEventListener("click", handleCart);
}
