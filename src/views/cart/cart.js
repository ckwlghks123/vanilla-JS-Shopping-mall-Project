/**
 * @fileName cart.js
 * @author 차지환
 * @date 2022-11-03
 * @description 장바구니 데이터를 불러와 화면을 구성하는 파일입니다.
 */

import {
  insertLogoutLi,
  insertMyPageLi,
  insertAdminLi,
  insertCategoryLi,
  insertProductLi,
  insertOrderLi,
  addAllEvents,
} from "../home/nav.js";
import * as Api from "../api.js";
import * as Storage from "../storage.js";

addAllElements();
addAllEvents();
async function addAllElements() {
  insertLogoutLi();
  insertMyPageLi();
  insertAdminLi();
  insertCategoryLi();
  insertProductLi();
  insertOrderLi();
}

const $cartMain = document.querySelector(".cart-main");
const $cartIn = document.querySelector(".cart-in");
const $cartNone = document.querySelector(".cart-none");
const $title = document.querySelector(".title");
const $list = document.querySelector(".product-list");
const $footTotal = document.querySelector(".foot-total");

const PORT = 3000;

let timer;
const token = Storage.get("token", false);

// 데이터가 비었을때 빈 장바구니 템플릿 생성하는 함수
function emptyCart() {
  $cartIn.classList.add("hidden");
  $footTotal.classList.add("hidden");
  $cartNone.classList.remove("hidden");
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
function renderProductsList(list) {
  const items = list
    .map(
      ({ product: { _id, name, price, images }, amount }) => `
       <div class="product" id="${_id}">
         <div class="product-section">
           <img src="../../../${
             images[0]
           }" alt="이미지" class="product-image" />
           <div class="product-description">
              <div class="product-name">${name}</div>
              <div class="product-stock">재고 있음</div>
           </div>
         </div>
         <div class="product-amount">
           <div>
             <button class="decrease" ${amount === 1 && "disabled"}>-</button>
             <div class="amount">${amount}</div>
             <button class="increase">+</button>
           </div>
         </div>
         <div class="product-total">${(
           price * amount
         ).toLocaleString()}<span>원</span></div>
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
      return Storage.get("cart");
    },
    async mem() {
      const item = Storage.get("cart");
      if (item) {
        const postBody = item.map(({ amount, product }) => ({
          amount,
          productId: product._id,
        }));
        await Promise.all(
          postBody.map(
            async (e) =>
              await Api.post(
                `${location.protocol}//${location.host}/api/cart`,
                e
              )
          )
        );
        Storage.clear("cart");
      }
      const data = await Api.get(
        `${location.protocol}//${location.host}`,
        "api/cart"
      );
      return data?.list;
    },
  };

  let data = await memType[type]();

  if (!data) {
    emptyCart();
    return;
  }

  renderProductsList(data);
  totalPrice(data);

  $cartIn.classList.remove("hidden");
  $footTotal.classList.remove("hidden");

  $cartMain.addEventListener("click", ({ target }) => {
    const parent = target.parentNode.parentNode;
    const id = parent.parentNode.id;
    const decrease = target.parentNode.querySelector(".decrease");
    const $productTotal = parent.parentNode.querySelector(".product-total");
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
          token
            ? Api.post(`${location.protocol}//${location.host}/api/cart`, {
                productId: id,
                amount: numAdd,
              })
            : Storage.set("cart", data);
        });

        break;

      case "decrease":
        const $elem2 = target.nextElementSibling;
        const numSub = Number($elem2.innerText) - 1;

        if (numSub === 1) target.disabled = true;

        data = getData(data, id, numSub);

        $elem2.innerText = numSub;

        $productTotal.innerText = getProductPrice(productData, numSub);

        totalPrice(data);

        debounce(() => {
          token
            ? Api.post(`${location.protocol}//${location.host}/api/cart`, {
                productId: id,
                amount: numSub,
              })
            : Storage.set("cart", data);
        });

        break;

      case "delete":
        $list.removeChild(parent);

        const deleteId = parent.id;

        data = data.filter((e) => e.product._id !== deleteId);

        totalPrice(data);

        token
          ? Api.delete(`${location.protocol}//${location.host}`, "api/cart", {
              productId: deleteId,
            })
          : Storage.set("cart", data);

        break;

      case "purchase-btn":
        token
          ? window.location.replace("/order")
          : window.location.replace("/login");
        break;

      case "product-image":
        location.replace(`/products/${id}`);

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

function getStorage(name, parse = true) {
  let item = null;
  try {
    item = parse
      ? JSON.parse(localStorage.getItem(name))
      : localStorage.getItem(name);
  } catch (e) {
    console.log(e);
  }
  return item;
}

token ? memberCart("mem") : memberCart("nonMem");
