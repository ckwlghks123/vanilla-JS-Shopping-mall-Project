// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
/**
 * @detail: 지금까지 작성된 코드는 nav와 관련된 코드로, 다른 페이지에서도 현재 js 파일과
 * home.html파일의 navbar 부분이 사용될 수 있습니다.
 * @editor: 김상현
 * @date: 2022-11-05
 */

import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const landingDiv = document.querySelector("#landingDiv");
const greetingDiv = document.querySelector("#greetingDiv");
const navbarUl = document.querySelector("#navbar");
const loginLi = document.querySelector("#navbar__login");
const registerLi = document.querySelector("#navbar__register");
const myPageLi = document.querySelector("#navbar__mypage");
const adminLi = document.querySelector("#navbar__admin");
const categoryLi = document.querySelector("#navbar__category");
const productLi = document.querySelector("#navbar__product");
const orderLi = document.querySelector("#navbar__order");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertTextToLanding();
  insertTextToGreeting();
  insertLogoutLi();
  insertMyPageLi();
  insertAdminLi();
  insertCategoryLi();
  insertProductLi();
  insertOrderLi();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  landingDiv.addEventListener("click", alertLandingText);
  greetingDiv.addEventListener("click", alertGreetingText);
  navbarUl.addEventListener("click", loginLogoutHandler);
}

function insertTextToLanding() {
  landingDiv.insertAdjacentHTML(
    "beforeend",
    `
      <h2>n팀 쇼핑몰의 랜딩 페이지입니다. 자바스크립트 파일에서 삽입되었습니다.</h2>
    `
  );
}

function insertTextToGreeting() {
  greetingDiv.insertAdjacentHTML(
    "beforeend",
    `
      <h1>반갑습니다! 자바스크립트 파일에서 삽입되었습니다.</h1>
    `
  );
}

function alertLandingText() {
  alert("n팀 쇼핑몰입니다. 안녕하세요.");
}

function alertGreetingText() {
  alert("n팀 쇼핑몰에 오신 것을 환영합니다");
}

// 로그인 상태일 경우 헤더 GUI 변경. (로그인 / 회원가입 ⇒ 로그아웃)
function insertLogoutLi() {
  if (localStorage.getItem("token")) {
    const logoutLi = document.createElement("li");
    const logoutA = document.createElement("a");
    logoutLi.id = "navbar__logout";
    logoutA.href = "/";
    logoutA.innerText = "로그아웃";
    logoutLi.appendChild(logoutA);
    navbarUl.removeChild(loginLi);
    navbarUl.removeChild(registerLi);
    navbarUl.insertBefore(logoutLi, navbarUl.firstChild);
  }
}

// 로그아웃 버튼을 누를 경우 세션 스토리지의 토큰, isAdmin을 없애고 홈 경로로 이동
// navbar Li 를 클릭시 각 연결된 페이지로 이동
function loginLogoutHandler(event) {
  event.preventDefault();
  switch (event.target.parentNode.id) {
    case "navbar__logout":
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      adminLi.style.display = "none";
      document.location.href = "/";
      break;
    case "navbar__login":
      document.location.href = "/login";
      break;
    case "navbar__register":
      document.location.href = "/register";
      break;
    case "navbar__mypage":
      document.location.href = "/mypage";
      break;
    case "navbar__category":
      document.location.href = "/admin/categories";
      break;
    case "navbar__product":
      document.location.href = "/admin/products";
      break;
    case "navbar__order":
      document.location.href = "/admin/orders";
      break;
    case "navbar__cart":
      document.location.href = "/cart";
  }
}

function insertMyPageLi() {
  if (localStorage.getItem("token")) {
    myPageLi.style.removeProperty("display");
  } else {
    myPageLi.style.style.display = "none";
  }
}

// 현재 로그인한 유저가 admin일경우 관리자 Li 태그 보임
function insertAdminLi() {
  if (localStorage.getItem("isAdmin") === "true") {
    adminLi.style.removeProperty("display");
  } else if (localStorage.getItem("isAdmin") === "false") {
    adminLi.style.display = "none";
  }
}

// 현재 로그인한 유저가 admin일경우 카테고리 Li 태그 보임
function insertCategoryLi() {
  if (localStorage.getItem("isAdmin") === "true") {
    categoryLi.style.removeProperty("display");
  } else if (localStorage.getItem("isAdmin") === "false") {
    categoryLi.style.display = "none";
  }
}

// 현재 로그인한 유저가 admin일경우 상품 Li 태그 보임
function insertProductLi() {
  if (localStorage.getItem("isAdmin") === "true") {
    productLi.style.removeProperty("display");
  } else if (localStorage.getItem("isAdmin") === "false") {
    productLi.style.display = "none";
  }
}

// 현재 로그인한 유저가 admin일경우 주문 Li 태그 보임
function insertOrderLi() {
  if (localStorage.getItem("isAdmin") === "true") {
    orderLi.style.removeProperty("display");
  } else if (localStorage.getItem("isAdmin") === "false") {
    orderLi.style.display = "none";
  }
}

async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
  const data = await Api.get("/api/user/data");
  const random = randomId();

  console.log({ data });
  console.log({ random });
}
