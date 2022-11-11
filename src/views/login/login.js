import * as Api from "/api.js";
import { validateEmail } from "/useful-functions.js";
import {
  insertLogoutLi,
  insertMyPageLi,
  insertAdminLi,
  insertCategoryLi,
  insertProductLi,
  insertOrderLi,
} from "../home/nav.js";

window.Kakao.init("de945249a2674c6c7c7b4c6b90c0ba7d");

// 요소(element), input 혹은 상수
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const submitButton = document.querySelector("#submitButton");
const kakaoLoginButton = document.querySelector("#kakaoLoginButton");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertLogoutLi();
  insertMyPageLi();
  insertAdminLi();
  insertCategoryLi();
  insertProductLi();
  insertOrderLi();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
  kakaoLoginButton.addEventListener("click", handleKakaoLogin);
}

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert(
      "비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요."
    );
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    const { userToken, user } = await Api.post("/api/login", data);
    const { isAdmin, loginMethod } = user;

    // 로그인 성공, 토큰 및 admin 유무를 로컬 스토리지에 저장
    localStorage.setItem("token", userToken);
    localStorage.setItem("isAdmin", isAdmin);
    localStorage.setItem("loginMethod", loginMethod);

    alert(`정상적으로 로그인되었습니다.`);

    // 기본 페이지로 이동
    window.location.href = "/";
  } catch (err) {
    console.error(err.stack);
    alert(`error: ${err.message}`);
  }
}

async function handleKakaoLogin(e) {
  window.Kakao.Auth.login({
    scope: "profile_nickname, account_email",
    success: async function (authObj) {
      localStorage.setItem("KakaoToken", authObj.access_token);
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: async (res) => {
          const kakao_account = res.kakao_account;
          const email = kakao_account.email;
          localStorage.setItem("email", email);
          // 이미 회원이면 로그인하고 홈으로, 회원가입이면 추가 입력페이지로 리다이렉트
          try {
            const { isExist } = await Api.get(`/api/email/${email}`);
            if (isExist) {
              const data = { email };
              const { userToken, user } = await Api.post(
                "/api/login-social",
                data
              );
              const { isAdmin, loginMethod } = user;

              localStorage.setItem("token", userToken);
              localStorage.setItem("isAdmin", isAdmin);
              localStorage.setItem("loginMethod", loginMethod);

              window.location.href = "/";
              alert(`정상적으로 로그인되었습니다.`);
            } else {
              window.location.href = "/register-social";
            }
          } catch (err) {
            console.error(err.stack);
            alert(`error: ${err.message}`);
          }
        },
      });
    },
  });
}
