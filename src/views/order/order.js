import * as Api from "../api.js";

const $productsList = document.querySelector(".products-list");

function renderProductsList(products) {
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

    $li.classList.add("product-wrapper");
    $imgWrapper.classList.add("product-img-wrapper");
    $info.classList.add("product-info");
    $titleWrapper.classList.add("product-capa-wrapper");
    $title.classList.add("product-capa");
    $quantity.classList.add("product-quantity");
    $priceWrapper.classList.add("product-price-wrapper");
    $price.classList.add("product-price");

    // $img.setAttribute("src", product.images[0]);
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
    $li.appendChild($imgWrapper);
    $li.appendChild($info);
    $productsList.appendChild($li);
  });
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
  return data.reduce(
    (price, { amount, product }) => price + amount * product.price,
    0
  );
}

async function getData() {
  // let data = await Api.get("http://localhost:3000", "api/cart");
  let data = await Api.get(".", "test.json");
  console.log(data);

  renderProductsList(data.list);

  const price = getTotalPrice(data.list);
  const total = updateTotalPrice(price);

  console.log(total);
}

getData();
