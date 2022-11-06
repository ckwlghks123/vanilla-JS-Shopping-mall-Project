import * as Api from "../api.js";

const $productsList = document.querySelector(".products-list");
const $paymentBtn = document.querySelector("#payment-btn");
const $userAddress = document.querySelector(".user-address");
const $zipCode = document.querySelector("#zip-code");
const $address = document.querySelector("#address");
const $detailAdress = document.querySelector("#detailed-address");
const $postCode = document.querySelector("#postcode");

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
    const $productInner = document.createElement("div");

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
    $li.appendChild($productInner);
    $productInner.appendChild($imgWrapper);
    $productInner.appendChild($info);
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

function makePopUp(x, y) {
  const width = 350;
  const height = 500;
  const border = 3;

  $postCode.style.width = `${width}px`;
  $postCode.style.height = `${height}px`;
  $postCode.style.border = `${border}px solid black`;
  $postCode.style.position = `absolute`;
  $postCode.style.left = `${x - 10}px`;
  $postCode.style.top = `${y - 10}px`;
}

async function getData() {
  // let data = await Api.get("http://localhost:3000", "api/cart");
  let data = await Api.get(".", "test.json");

  renderProductsList(data.list);

  const price = getTotalPrice(data.list);
  const total = updateTotalPrice(price);

  $userAddress.addEventListener("click", (e) => {
    const target = e.target;
    if (target.className === "zip-address-wrapper") {
      const [x, y] = [e.pageX, e.pageY];
      console.log(x, y);
      new daum.Postcode({
        oncomplete: function (address) {
          $zipCode.value = address.zonecode;
          $address.value = address.address;
          $detailAdress.focus();
        },
        onclose: () => {
          $postCode.style.display = "none";
        },
        width: "100%",
        height: "100%",
      }).embed($postCode, {});
      $postCode.style.display = "block";
      makePopUp(x, y);
    }
  });
}

$productsList.addEventListener("click", ({ target }) => {
  if (target.className === "product-img-wrapper") {
    const id = target.parentNode.parentNode.id;
    window.location.replace(`/products/${id}`);
  }
});

$paymentBtn.addEventListener("click", (e) => {});

getData();
