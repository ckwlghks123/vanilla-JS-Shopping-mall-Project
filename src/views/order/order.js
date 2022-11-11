/**
 * @fileName order.js
 * @author 차지환
 * @date 2022-11-07
 * @description 장바구니 데이터를 불러와 주문자 정보를 입력하고 결제를 수행하는 파일입니다.
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

const PORT = 3000;
const pg_token = new URLSearchParams(location.search).get("pg_token");
const result = new URLSearchParams(location.search).get("result");

if (pg_token) {
  Api.post(
    `${location.protocol}//${location.host}/api/order/register`,
    Storage.get("order")
  );
  Storage.clear("order");
  // window.location.replace("/order/result");
} else if (result) {
  Storage.clear("order");
}

const ADMIN_KEY = "488ad1ea656667486f4f0657731dd055";

const $productsList = document.querySelector(".products-list");
const $paymentBtn = document.querySelector("#payment-btn");
const $userAddress = document.querySelector(".user-address");
const $zipCode = document.querySelector("#zip-code");
const $address = document.querySelector("#address");
const $detailAdress = document.querySelector("#detailed-address");
const $postCode = document.querySelector("#postcode");
const $kakao = document.querySelector("#kakao");
const $orderInfo = document.querySelector(".order-info");
const $postWrap = document.querySelector(".postcode-wrapper");
const $postClose = document.querySelector("#postcode-close");

function renderProductsList(products) {
  try {
    products.forEach(({ amount, product, _id }) => {
      const $li = document.createElement("li");
      const $imgWrapper = document.createElement("div");
      const $img = document.createElement("img");
      const $info = document.createElement("div");
      const $titleWrapper = document.createElement("div");
      const $title = document.createElement("h3");
      const $quantity = document.createElement("div");
      const $priceWrapper = document.createElement("div");
      const $price = document.createElement("strong");
      const $productInner = document.createElement("div");

      $productInner.classList.add("product-inner-box");
      $li.classList.add("product-wrapper");
      $imgWrapper.classList.add("product-img-wrapper");
      $info.classList.add("product-info");
      $titleWrapper.classList.add("product-capa-wrapper");
      $title.classList.add("product-capa");
      $quantity.classList.add("product-quantity");
      $priceWrapper.classList.add("product-price-wrapper");
      $price.classList.add("product-price");

      $img.setAttribute("src", `../../../${product.images[0]}`);
      $li.setAttribute("id", _id);
      $quantity.innerText = `수량 : ${amount}개`;
      $title.innerText = product.name;
      $price.innerHTML = `${(
        product.price * amount
      ).toLocaleString()}<span>원</span>`;

      $priceWrapper.appendChild($price);
      $titleWrapper.appendChild($title);
      $titleWrapper.appendChild($quantity);
      $info.appendChild($titleWrapper);
      $info.appendChild($priceWrapper);
      $imgWrapper.appendChild($img);
      $li.appendChild($productInner);
      $productInner.appendChild($imgWrapper);
      $productInner.appendChild($info);
      $productsList.appendChild($li);
    });
  } catch (e) {
    alert(e.message);
  }
}

function updateTotalPrice(price) {
  const $totalPrice = document.querySelector(".total-price");
  const $productShip = document.querySelector(".product-ship");
  const $totalShip = document.querySelector(".total-ship");
  const $totalPayment = document.querySelector(".total-payment");
  const shipment = price >= 30000 ? 0 : 3000;
  const string = price >= 30000 ? "무료" : "3,000원";
  const total = price + shipment;

  $totalPrice.innerText = `${price.toLocaleString()}원`;
  $productShip.innerText = `배송비 : ${string}`;
  $totalShip.innerText = string;
  $totalPayment.innerText = `${total.toLocaleString()}원`;

  return total;
}

function getTotalPrice(data) {
  let total;
  try {
    total = data.reduce(
      (price, { amount, product }) => price + amount * product.price,
      0
    );
  } catch (e) {
    alert(e.message);
  }

  return total;
}

function makePopUp(x, y) {
  const width = 350;
  const height = 500;
  const border = 3;

  $postCode.style.width = `${width}px`;
  $postCode.style.height = `${height}px`;
  $postCode.style.border = `${border}px solid black`;
  $postWrap.style.position = `absolute`;
  $postWrap.style.left = `${x - 10}px`;
  $postWrap.style.top = `${y - 50}px`;
}

async function getData() {
  let data = await Api.get(
    `${location.protocol}//${location.host}`,
    "api/cart"
  );

  renderProductsList(data.list);

  const id = data._id;
  const price = getTotalPrice(data.list);
  const total = updateTotalPrice(price);

  $paymentBtn.addEventListener("click", (e) => {
    const paymentMethod = document.querySelector("input[type=radio]:checked");
    if (!paymentMethod) return alert("결제 방법을 선택해주세요");
    switch (paymentMethod.value) {
      case "CARD":
        purchase("card", total, id);
        break;
      case "KAKAO":
        purchase("kakao", total, id);
        break;
      default:
        return;
    }
  });
}

$userAddress.addEventListener("click", (e) => {
  const target = e.target;
  if (target.className === "zip-address-wrapper") {
    const [x, y] = [e.pageX, e.pageY];

    new daum.Postcode({
      oncomplete: ({ zonecode, address }) => {
        $zipCode.value = zonecode;
        $address.value = address;
        $detailAdress.focus();
      },
      onclose: () => {
        $postCode.style.display = "none";
        $postWrap.style.display = "none";
      },
      width: "100%",
      height: "100%",
    }).embed($postCode, {});
    $postCode.style.display = "block";
    $postWrap.style.display = "block";
    makePopUp(x, y);
  }
});

$productsList.addEventListener("click", ({ target }) => {
  if (target.className === "product-img-wrapper") {
    const id = target.parentNode.parentNode.id;
    window.location.replace(`/products/${id}`);
  }
});

function purchase(type, total, id) {
  const uid = `elice_${new Date().getTime()}`;
  const formData = getFormData(id);
  const paymentType = {
    card: () => {
      const IMP = window.IMP;
      IMP.init("imp84455120");
      IMP.request_pay(
        {
          pg: "inicis",
          pay_method: "card",
          merchant_uid: uid,
          name: "결제테스트2",
          amount: 100, // total
          buyer_email: "test@test.com", // 구매자 이메일
          buyer_name: "엘리스", // 구매자 이름
          buyer_tel: "010-1111-1111", // 구매자 전화번호
          buyer_addr: "구매자 정보",
          buyer_postcode: "01111", // 구매자 우편번호
        },
        (res) => {
          if (res.success) {
            Api.post(
              `${location.protocol}//${location.host}/api/order/register`,
              formData
            );
            window.location.replace("/order/result");
          } else {
            alert("결제 실패");
          }
        }
      );
    },
    kakao: () => {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `KakaoAK ${ADMIN_KEY}`);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("cid", "TC0ONETIME");
      urlencoded.append("partner_order_id", "partner_order_id");
      urlencoded.append("partner_user_id", "partner_user_id");
      urlencoded.append("item_name", "족발");
      urlencoded.append("quantity", "1");
      urlencoded.append("total_amount", "100");
      urlencoded.append("tax_free_amount", "0");
      urlencoded.append(
        "approval_url",
        `${location.protocol}//${location.host}/order`
      );
      urlencoded.append(
        "fail_url",
        `${location.protocol}//${location.host}/order?result=fail`
      );
      urlencoded.append(
        "cancel_url",
        `${location.protocol}//${location.host}/order`
      );

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      fetch("https://kapi.kakao.com/v1/payment/ready", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          const { tid, next_redirect_pc_url } = result;
          Storage.set("order", formData);
          location.href = next_redirect_pc_url;
        })
        .catch((error) => console.log("error", error));
    },
  };
  paymentType[type]();
}

function getFormData(id) {
  const $receiver = document.querySelector("#receiver");
  const $phone = document.querySelector("#phone");
  const $address = document.querySelector("#address");
  const $detail = document.querySelector("#detailed-address");
  const $requirements = document.querySelector("#requirements");
  const data = {
    cartId: id,
    receiver: $receiver.value,
    phone: $phone.value,
    address: `${$zipCode.value} ${$address.value} ${$detail.value}`,
    requirements: $requirements.value,
  };

  return data;
}

$postClose.addEventListener("click", (e) => {
  e.preventDefault();
  const $close = document.querySelector(".postcode-wrapper");
  $close.style.display = "none";
});
getData();
