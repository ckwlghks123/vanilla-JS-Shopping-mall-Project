/**
 * @author: 김상현
 * @detail: 마이페이지를 위한 js파일입니다.
 */

import * as Api from "/api.js";
import { validateEmail } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const userAdmin = document.querySelector("#user-admin");
const userName = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");
const userPassword = document.querySelector("#user-password");
const userWithdraw = document.querySelector("#user-widthdraw");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertIsAdmin();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

// admin 유저일 경우 이름 위에 관리자 표시
function insertIsAdmin() {
  if (localStorage.getItem("isAdmin") === "true") {
    userAdmin.style.removeProperty("display");
  } else if (localStorage.getItem("isAdmin") === "false") {
    userAdmin.style.display = "none";
  }
}
