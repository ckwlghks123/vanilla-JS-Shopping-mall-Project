import * as Api from "../api.js";

const $cartMain = document.querySelector(".cart-main");
const $shipCost = document.querySelector(".shipping-cost");

const token = getStorage("token");

function getStorage(name) {
  let item = {};
  try {
    item = JSON.parse(localStorage.getItem(name));
  } catch (e) {
    console.warn(e);
    // window.location.replace("/login");
  }
  return item;
}

function genTemplate(type, data) {
  function genItems(items) {
    return items.map(
      ({ name, amount, price, images }) => `<div class="product">
        <div class="product-section">
          <img src=${images} alt="" class="product-image" />
          <div class="product-name">${name}</div>
          <div class="product-stock">재고 있음</div>
        </div>
        <div class="product-amount">
          <button class="decrease">-</button>
          <div class="amount">${amount}</div>
          <button class="decrease">+</button>
        </div>
        <div class="total-price">${price.toLocaleString()}원</div>
        <div class="section-button">
          <button class="delete">삭제</button>
          <button class="later">나중에 사기</button>
        </div>
      </div>`
    );
  }

  const items = genItems(data.items);

  if (type === "none") {
    $cartMain.innerHTML = `
    <div class="cart-none">
      <img src="" alt="카트이미지" class="cart-image" />
      <span>장바구니에 담긴 상품이 없습니다.</span>
    </div>
    `;
  } else if (type === "in") {
    $shipCost.insertAdjacentHTML("beforebegin", items);
  }
}

async function memberCart() {
  const memType = {
    nonMem() {
      return getStorage("cart");
    },
    mem() {
      return fetch("./test.json").then((res) => res.json());
    },
  };

  const data = await memType["nonMem"]();

  if (Object.keys(data).length === 0) {
    genTemplate("none");
    return;
  }

  genTemplate("in", data);
}

memberCart();
