import * as Api from "../api.js";

const $cartMain = document.querySelector(".cart-main");
const $cartIn = document.querySelector(".cart-in");

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

function nonTemplate() {
  $cartMain.innerHTML = `
  <div class="cart-none">
    <img src="" alt="카트이미지" class="cart-image" />
    <span>장바구니에 담긴 상품이 없습니다.</span>
  </div>
  `;
}

function genTemplate({ list }) {
  const productPrice = list.reduce(
    (acc, item) => acc + item.price * item.amount,
    0
  );
  const shipFee = productPrice < 30000 ? 3000 : 0;
  const total = (productPrice + shipFee).toLocaleString();
  const items = list.map(
    ({ name, amount, price, images }) => `
      <div class="product">
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
        <div class="total-price">${(price * amount).toLocaleString()}원</div>
        <div class="section-button">
          <button class="delete">삭제</button>
          <button class="later">나중에 사기</button>
        </div>
      </div>`
  );

  const costTemplate = `        
  <div class="shipping-cost">
    <div class="price">
      <span>상품금액</span>
      <strong>${productPrice.toLocaleString()}원</strong>
    </div>
    <div class="shipping">
      <span>배송비(30,000원 이상 무료)</span>
      <strong>${shipFee === 3000 ? "3,000원" : "무료"}</strong>
    </div>
    <div class="total">
      <span>주문금액</span>
      <strong>${total}원</strong>
    </div>
  </div>
  <footer>
    <div class="footer-price">
      <span>총 상품금액</span>
      <strong>${productPrice.toLocaleString()}원</strong>
    </div>
    <div class="footer-shipping">
      <span>총 배송비</span>
      <strong>+${shipFee === 3000 ? "3,000원" : "무료"}</strong>
    </div>
    <div class="footer-total">
      <span>결제금액</span>
      <strong>${total}원</strong>
      <button class="purchase">구매하기</button>
    </div>
  </footer>`;

  $cartIn.insertAdjacentHTML("beforeend", items);
  $cartIn.insertAdjacentHTML("beforeend", costTemplate);
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

  let data = await memType[type]();

  function setState(newState) {
    data = newState;
    genTemplate(data);
  }

  if (!data) {
    nonTemplate();
    return;
  }

  genTemplate(data);

  $cartMain.addEventListener("click", (e) => {});
}

token ? memberCart("mem") : memberCart("nonMem");
