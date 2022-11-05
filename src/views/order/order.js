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

function getTotalPrice(data) {}

async function getData() {
  // let data = await Api.get("http://localhost:3000", "api/cart");
  let data = await Api.get(".", "test.json");
  console.log(data);
  renderProductsList(data.list);
}

getData();
