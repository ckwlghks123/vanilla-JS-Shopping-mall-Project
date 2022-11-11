/**
 * @author: 김상현
 * @date: 2022-11-08
 * @detail: 카카오를 통한 첫 로그인 시도 시 회원가입을 위한 추가 정보 입력 페이지
 */
import * as Api from "/api.js";
import {
  insertLogoutLi,
  insertMyPageLi,
  insertAdminLi,
  insertCategoryLi,
  insertProductLi,
  insertOrderLi,
} from "../home/nav.js";

// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector("#fullNameInput");
const postCodeInput = document.querySelector("#postCodeInput");
const addressInput = document.querySelector("#addressInput");
const submitButton = document.querySelector("#submitButton");
const postCodeSearchButton = document.querySelector("#postCodeSearchButton");
const detailAddressInput = document.querySelector("#detailAddressInput");

// isUserRedirect();
addAllElements(await redirectNaverLogin());
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
  postCodeSearchButton.addEventListener("click", handleDaumPost);
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const postCode = postCodeInput.value;
  let address = addressInput.value;
  let detailAddress = detailAddressInput.value || "";

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isPostCodeValid = postCode.length === 5;
  const isAddressValid = address.length >= 2;

  if (!isFullNameValid) {
    return alert("이름은 2글자 이상이어야 합니다.");
  }

  if (!isPostCodeValid) {
    return alert("우편번호는 숫자 5자리를 입력해 주세요.");
  }

  if (!isAddressValid) {
    return alert("올바른 주소를 입력해주세요.");
  }

  // 주소와 상세주소를 합침
  address = address + ", " + detailAddress;

  // 회원가입 api 요청
  try {
    const email = localStorage.getItem("email");
    const socialLoginMethod = localStorage.getItem("loginMethod");
    let data = {
      fullName,
      email,
      postCode,
      address,
      loginMethod: socialLoginMethod,
    };

    await Api.post("/api/register-social", data);

    // 로그인 API를 거쳐 토큰을 받고 홈으로 이동
    data = { email };
    const { userToken, user } = await Api.post("/api/login-social", data);
    const { isAdmin, loginMethod } = user;

    localStorage.setItem("token", userToken);
    localStorage.setItem("isAdmin", isAdmin);
    localStorage.setItem("loginMethod", loginMethod);

    window.location.href = "/";
    alert(`정상적으로 회원가입되었습니다.`);
  } catch (err) {
    console.error(err.stack);
    alert(`error: ${err.message}`);
  }
}

function handleDaumPost(e) {
  const width = 500;
  const height = 600;
  new daum.Postcode({
    width: width,
    height: height,
    oncomplete: function (data) {
      let address = "";

      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소 클릭
        address = data.roadAddress;
      } else {
        // 사용자가 지번 주소 클릭
        address = data.jibunAddress;
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      postCodeInput.value = data.zonecode;
      addressInput.value = address;
      // 커서를 상세주소 필드로 이동한다.
      detailAddressInput.focus();
    },
  }).open({
    left: window.screen.width / 2 - width / 2,
    top: window.screen.height / 2 - height / 2,
  });
}

async function redirectNaverLogin() {
  // 네이버 로그인이 이미 회원이면 로그인하고 홈으로
  const loginMethod = localStorage.getItem("loginMethod");
  const email = localStorage.getItem("email");
  if (loginMethod === "NAVER") {
    try {
      const { isExist } = await Api.get(`/api/email/${email}`);
      if (isExist) {
        const data = { email };
        const { userToken, user } = await Api.post("/api/login-social", data);
        const { isAdmin, loginMethod } = user;

        localStorage.setItem("token", userToken);
        localStorage.setItem("isAdmin", isAdmin);
        localStorage.setItem("loginMethod", loginMethod);

        window.location.href = "/";
        alert(`정상적으로 로그인되었습니다.`);
      }
    } catch (err) {
      console.error(err.stack);
      alert(`error: ${err.message}`);
    }
  }
}
