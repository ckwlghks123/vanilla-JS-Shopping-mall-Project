// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const landingDiv = document.querySelector("#landingDiv");
const greetingDiv = document.querySelector("#greetingDiv");
const navbarUl = document.querySelector("#navbar");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertTextToLanding();
  insertTextToGreeting();
  insertLogoutLi();
  insertAdminLi();
  insertMyPageLi();
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
    const loginLi = document.querySelector("#navbar__login");
    const registerLi = document.querySelector("#navbar__register");
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
// 로그인, 회원가입 버튼 클릭시 해당 페이지로 이동
function loginLogoutHandler(event) {
  event.preventDefault();
  if (event.target.parentNode.id === "navbar__logout") {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    document.querySelector("#navbar__admin").style.display = "none";
    document.location.href = "/";
  } else if (event.target.parentNode.id === "navbar__login") {
    document.location.href = "/login";
  } else if (event.target.parentNode.id === "navbar__register") {
    document.location.href = "/register";
  } else if (event.target.parentNode.id === "navbar__mypage") {
    document.location.href = "/mypage";
  }
}

// 현재 로그인한 유저가 admin일경우 관리자 Li 태그 보임
function insertAdminLi() {
  if (localStorage.getItem("isAdmin") === "true") {
    document.querySelector("#navbar__admin").style.removeProperty("display");
  } else if (localStorage.getItem("isAdmin") === "false") {
    document.querySelector("#navbar__admin").style.display = "none";
  }
}

function insertMyPageLi() {
  if (localStorage.getItem("token")) {
    document.querySelector("#navbar__mypage").style.removeProperty("display");
  } else {
    document.querySelector("#navbar__mypage").style.style.display = "none";
  }
}

async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
  const data = await Api.get("/api/user/data");
  const random = randomId();

  console.log({ data });
  console.log({ random });
}
