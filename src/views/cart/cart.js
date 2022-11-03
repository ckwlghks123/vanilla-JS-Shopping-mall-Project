import * as Api from "../api.js";

const $cartMain = document.querySelector(".cart-main");
const $cartIn = document.querySelector(".cart-in");
const $title = document.querySelector(".title");
const $list = document.querySelector(".product-list");

const token = getStorage("token");

function getStorage(name) {
  let item = null;
  try {
    item = JSON.parse(localStorage.getItem(name));
  } catch (e) {
    console.warn(e);
    // window.location.replace("/login");
  }
  return item;
}

function emptyCart() {
  $cartMain.innerHTML = `
  <div class="cart-none">
    <img src="" alt="카트이미지" class="cart-image" />
    <span>장바구니에 담긴 상품이 없습니다.</span>
  </div>
  `;
}

function totalPrice(list) {
  if (list.length === 0) {
    return emptyCart();
  }

  const productPrice = list.reduce(
    (acc, item) => acc + item.price * item.amount,
    0
  );
  const shipFee = productPrice < 30000 ? 3000 : 0;
  const total = (productPrice + shipFee).toLocaleString();
  const $productPrices = document.querySelectorAll(".product-price");
  const $totalPrices = document.querySelectorAll(".total-price");
  const $ship = document.querySelectorAll(".ship");

  $ship.forEach((e) => (e.innerText = `${shipFee.toLocaleString()}원`));

  $productPrices.forEach(
    (e) => (e.innerText = `${productPrice.toLocaleString()}원`)
  );

  $totalPrices.forEach((e) => (e.innerText = `${total}원`));
}

function genProduct(list) {
  const items = list
    .map(
      ({ id, name, amount, price, images }) => `
      <div class="product" id="${id}">
        <div class="product-section">
          <img src="${images}" alt="이미지" class="product-image" />
          <div class="product-name">${name}</div>
          <div class="product-stock">재고 있음</div>
        </div>
        <div class="product-amount">
          <button class="decrease" ${amount === 1 && "disabled"}>-</button>
          <div class="amount">${amount}</div>
          <button class="increase">+</button>
        </div>
        <div class="product-total">${(price * amount).toLocaleString()}원</div>
        <div class="section-button">
          <button class="delete">삭제</button>
        </div>
      </div>`
    )
    .join("");
  $list.innerHTML = items;
}

async function memberCart(type) {
  const memType = {
    nonMem() {
      return getStorage("cart");
    },
    mem() {
      return fetch("./test.json").then((res) => res.json());
      // 정식 요청할때 Api.js 사용
    },
  };

  let data = (await memType[type]()).list;

  if (!data) {
    emptyCart();
    return;
  }

  genProduct(data);
  totalPrice(data);

  $cartIn.style.display = "block";

  $cartMain.addEventListener("click", ({ target }) => {
    const parent = target.parentNode.parentNode;
    const id = parent.id;
    const decrease = target.parentNode.querySelector(".decrease");
    const $productTotal = parent.querySelector(".product-total");
    const productData = data.find((e) => e.id === Number(id));

    switch (target.className) {
      case "increase":
        const $elem = target.previousElementSibling;
        const numAdd = Number($elem.innerText) + 1;

        if (numAdd === 2) decrease.disabled = false;

        $elem.innerText = numAdd;

        data = data.map((e) =>
          e.id === Number(id) ? { ...e, amount: numAdd } : e
        );

        $productTotal.innerText = `${(
          productData.price * numAdd
        ).toLocaleString()}원`;

        totalPrice(data);
        // post 요청
        break;

      case "decrease":
        const $elem2 = target.nextElementSibling;
        const numSub = Number($elem2.innerText) - 1;

        if (numSub === 1) target.disabled = true;

        $elem2.innerText = numSub;

        data = data.map((e) =>
          e.id === Number(id) ? { ...e, amount: numSub } : e
        );

        $productTotal.innerText = `${(
          productData.price * numSub
        ).toLocaleString()}원`;

        totalPrice(data);
        // post 요청
        break;

      case "delete":
        $list.removeChild(parent);

        data = data.filter((e) => e.id !== Number(id));
        totalPrice(data);
        // deleted = data.find(e=> e.id === Number(id));
        // delete 요청

        break;
      case "puchase-btn":
        // post 요청
        break;
      default:
        return;
    }
  });
}

token ? memberCart("mem") : memberCart("nonMem");
