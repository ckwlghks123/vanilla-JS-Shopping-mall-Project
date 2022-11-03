/**
 * @fileName cart.js
 * @author 차지환
 * @date 2022-11-03
 * @description 장바구니 데이터를 불러와 화면을 구성하는 파일입니다.
 */

import * as Api from "../api.js";

const $cartMain = document.querySelector(".cart-main");
const $cartIn = document.querySelector(".cart-in");
const $title = document.querySelector(".title");
const $list = document.querySelector(".product-list");

const token = getStorage("token");
let timer;

function getStorage(name) {
  let item = null;
  try {
    item = JSON.parse(localStorage.getItem(name));
  } catch (e) {
    console.warn(e);
  }
  return item;
}

// 데이터가 비었을때 빈 장바구니 템플릿 생성하는 함수
function emptyCart() {
  $cartMain.innerHTML = `
  <div class="cart-none">
    <img src="" alt="카트이미지" class="cart-image" />
    <span>장바구니에 담긴 상품이 없습니다.</span>
  </div>
  `;
}

// 데이터를 인자로 받아서 총 주문금액을 갱신하는 함수
function totalPrice(list) {
  if (list.length === 0) {
    return emptyCart();
  }

  const productPrice = list.reduce(
    (acc, item) => acc + item.product.price * item.amount,
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

// 데이터를 인자로 받아서 상품 갯수만큼 템플릿 생성
function genProduct(list) {
  const items = list
    .map(
      ({ product: { _id, name, price, images }, amount }) => `
      <div class="product" id="${_id}">
        <div class="product-section">
          <img src="${images[0]}" alt="이미지" class="product-image" />
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
      // return Api.get("localhost:8989", "api/cart");
      // 정식 요청할때 Api.js 사용
    },
  };

  let data = (await memType[type]())?.list;

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
    const productData = data.find((e) => e.product._id === id);

    switch (target.className) {
      case "increase":
        const $elem = target.previousElementSibling;
        const numAdd = Number($elem.innerText) + 1;

        if (numAdd === 2) decrease.disabled = false;

        $elem.innerText = numAdd;

        data = getData(data, id, numAdd);

        $productTotal.innerText = getProductPrice(productData, numAdd);

        totalPrice(data);

        debounce(() => {
          // Api.post('http://localhost:8989/api/cart', {
          //   productId: id,
          //   amount: numAdd,
          // })

          // 로컬 스토리지 저장 구현해야함

          console.log("증가");
        });
        break;

      case "decrease":
        const $elem2 = target.nextElementSibling;
        const numSub = Number($elem2.innerText) - 1;

        if (numSub === 1) target.disabled = true;

        $elem2.innerText = numSub;

        data = getData(data, id, numSub);

        $productTotal.innerText = getProductPrice(productData, numSub);

        totalPrice(data);

        debounce(() => {
          // Api.post('http://localhost:8989/api/cart', {
          //   productId: id,
          //   amount: numSub,
          // })

          // 로컬 스토리지 저장 구현해야함

          console.log("감소");
        });
        break;

      case "delete":
        $list.removeChild(parent);

        data = data.filter((e) => e.product._id !== id);

        totalPrice(data);

        // Api.del("http://localhost:8989", "api/cart", {
        //   productId: id,
        // });

        // 로컬 스토리지 삭제 구현해야함

        console.log("삭제되었습니다");
        break;

      case "purchase-btn":
        token
          ? window.location.replace("/order")
          : window.location.replace("/login");

        break;

      default:
        return;
    }
  });
}

function debounce(cb) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    cb();
  }, 600);
}

function getData(data, id, num) {
  return data.map((e) => (e.product._id === id ? { ...e, amount: num } : e));
}

function getProductPrice(data, num) {
  return `${(data.product.price * num).toLocaleString()}원`;
}

token ? memberCart("mem") : memberCart("nonMem");
