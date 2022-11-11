/**
 * @author 차지환
 * @date 2022-11-09
 * @description 고객의 주문정보를 조회, 수정, 삭제 하는 코드입니다.
 */

import * as Api from "/api.js";

let data = null;
let currentPage = null;
let last = null;
let first = null;
let totalP = null;

const $ul = document.querySelector("#page-btn");
const $table = document.querySelector(".order-table");
const $noData = document.querySelector(".no-data");
const $orderData = document.querySelector(".order-data");
const $menu = document.querySelector(".my-order-menu-list");

async function getOrderInfoData(currentPage = 1, type) {
  let data = await Api.get(
    "/api",
    `orderlist/me?page=${currentPage}&perPage=5`
  );
  // data = await fetch("./test.json").then((res) => res.json());
  currentPage = data.page;
  console.log(data);
  if (data.orders.length > 0) {
    $noData.classList.add("hidden");
    $orderData.classList.remove("hidden");
    renderOrderList(data, type);
  }
}

function renderOrderList(
  { page, perPage, totalPage, totalCount, orders },
  type = "getInfo"
) {
  const orderState = {
    WAIT: "배송준비 중",
    INPROGRESS: "배송 중",
    COMPLETED: "배송 완료",
    CANCEL: "주문 취소",
  };
  console.log(orders);
  $table.innerHTML = "";

  const orderHTML = orders
    .map(({ _id, createdAt, process, list }) => {
      const total = list.reduce(
        (acc, { amount, product }) => acc + product.price * amount,
        0
      );
      const ship = total >= 30000 ? "무료" : "3,000원";
      return list
        .map(({ amount, product: { name, images, price, _id } }, index) => {
          const productPrice = (amount * price).toLocaleString();
          return index === 0
            ? `
        <tr>
          <td
            class="product-order-num"
            rowspan="${list.length}"
            align="center"
            style="vertical-align: middle"
          >
            ${_id}<br/>(${createdAt.slice(0, 10)})
          </td>
          <td class="product-info" align="center">
            <div class="product-image-wrapper">
              <img class="product-image" src="${images[0]}" alt="상품 이미지" />
            </div>
            <div class="product-name-wrapper">
              <p class="product-name">
                ${name}
              </p>
            </div>
          </td>
          <td class="product-price-wrapper" align="center">
            <p class="product-price">${productPrice}원<br />(${amount}개)</p>
          </td>
          <td rowspan="${list.length}" align="center">
            <p>${ship}</p>
          </td>
          <td rowspan="${list.length}" align="center">
            <p>
              ${orderState[process]}
            </p>
          </td>
          <td rowspan="${list.length}" align="center">
            <button class="order-cancel" ${
              process === "CANCEL" && "disabled"
            } data-id="${_id}"}>${
                process === "CANCEL" ? "취소 완료" : "주문 취소"
              }</button>
          </td>
        </tr>`
            : `
        <tr>
          <td class="product-info" align="center">
            <div class="product-image-wrapper">
              <img class="product-image" src="../../../${images[0]}" alt="상품 이미지" />
            </div>
            <div class="product-name-wrapper">
              <p class="product-name">
                ${name}
              </p>
            </div>
          </td>
          <td class="product-price-wrapper" align="center">
            <p class="product-price">${productPrice}원<br />(${amount}개)</p>
          </td>
        </tr>`;
        })
        .join("");
    })
    .join("");

  const getInfoheadHTML = `
  <th>주문 번호<br />주문 일자</th>
  <th>주문 상품 정보</th>
  <th>상품 금액(수량)</th>
  <th>배송비</th>
  <th>배송 상태</th>
  <th>주문 취소<th>
  `;

  if (type === "getInfo") {
    $table.insertAdjacentHTML("beforeend", getInfoheadHTML);
    $table.insertAdjacentHTML("beforeend", orderHTML);
  } else if (type === "changeInfo") {
    const { orderInfoHTML, headHTML } = getOrderInfoHTML(orders, orderState);
    $table.insertAdjacentHTML("beforeend", headHTML);
    $table.insertAdjacentHTML("beforeend", orderInfoHTML);
  }

  pagenation(page, perPage, totalPage, totalCount);
}

function getOrderInfoHTML(orders, orderState) {
  const orderInfoHTML = orders
    .map(
      ({ _id, createdAt, process, phone, receiver, requirement }) => `
    <tr>
    <td
      class="order-num"
      align="center"
      style="vertical-align: middle"
    >
      ${_id}<br/>(${createdAt.slice(0, 10)})
    </td>
    <td class="order-info" align="center">
      <div class="order-name-wrapper">
        <p class="order-name">
          ${receiver}
        </p>
      </div>
    </td>
    <td class="order-phone-wrapper" align="center">
      <p class="order-phone">${phone}</p>
    </td>
    <td align="center">
      <p>${requirement}</p>
    </td>
    <td align="center">
      <p>
        ${orderState[process]}
      </p>
    </td>
    <td align="center">
      <button class="order-info-change" data-id="${_id}"}>배송정보 변경</button>
    </td>
     </tr>`
    )
    .join("");

  const headHTML = `
  <th>주문 번호<br />주문 일자</th>
  <th>받는 사람</th>
  <th>전화 번호</th>
  <th>요구사항</th>
  <th>배송 상태</th>
  <th>정보 변경<th>
  `;
  return { orderInfoHTML, headHTML };
}

function pagenation(page, perPage, totalPage, totalCount) {
  $ul.innerHTML = "";
  if (totalCount <= 5) return;
  const pageGroup = Math.ceil(page / 5);
  totalP = totalPage;
  last = pageGroup * 5;
  last > totalPage && (last = totalPage);
  first = last - 4;
  first < 0 && (first = 1);
  let prev = first - 1;

  if (prev > 0) {
    $ul.insertAdjacentHTML(
      "beforeend",
      `
    <li>
      <a class="all-prev-btn">&lt;&lt;&nbsp;</a>
    </li>
    <li>
      <a class="prev-btn">&lt;</a>
    </li>
    `
    );
  }

  for (let i = first; i <= last; i++) {
    $ul.insertAdjacentHTML(
      "beforeend",
      `<li><a data-page="${i}">${i}</a></li>`
    );
  }

  if (last < totalPage) {
    $ul.insertAdjacentHTML(
      "beforeend",
      `
      <li>
      <a class="next-btn">&gt;</a>
      </li>
      <li>
        <a class="all-next-btn">&nbsp;&gt;&gt;</a>
      </li>
    `
    );
  }

  document.querySelector(`a[data-page="${page}"]`).classList.add("clicked");
}

$ul.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;
  const $active = document.querySelector(".active");
  const type = $active.dataset.type;
  if (target.dataset.page) {
    getOrderInfoData(target.dataset.page, type);
  }

  switch (target.className) {
    case "all-prev-btn":
      getOrderInfoData(1, type);
      break;
    case "prev-btn":
      getOrderInfoData(first - 1, type);
      break;
    case "all-next-btn":
      getOrderInfoData(totalP, type);
      break;
    case "next-btn":
      getOrderInfoData(last + 1, type);
      break;
  }
});

$table.addEventListener("click", async (e) => {
  e.preventDefault();
  const target = e.target;
  switch (target.className) {
    case "order-cancel":
      const id = target.dataset.id;
      const response = await Api.post(`/api/orderstate/${id}`, {
        process: "CANCEL",
      });

      getOrderInfoData(currentPage);
      // target.innerText = "취소 완료";
      // target.disabled = true;
      break;
  }
});

$menu.addEventListener("click", ({ target }) => {
  if (!target.classList.contains("active")) {
    const $active = $menu.querySelector(".active");
    $active.classList.remove("active");
    target.classList.add("active");
    getOrderInfoData(1, target.dataset.type);
  }
});

getOrderInfoData();
