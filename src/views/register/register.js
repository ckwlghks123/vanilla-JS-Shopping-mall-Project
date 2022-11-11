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

// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector("#fullNameInput");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const passwordConfirmInput = document.querySelector("#passwordConfirmInput");
const postCodeInput = document.querySelector("#postCodeInput");
const addressInput = document.querySelector("#addressInput");
const submitButton = document.querySelector("#submitButton");
const emailCheckButton = document.querySelector("#emailCheck");
const postCodeSearchButton = document.querySelector("#postCodeSearchButton");
const detailAddressInput = document.querySelector("#detailAddressInput");

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
  emailCheckButton.addEventListener("click", handleEmailCheck);
  postCodeSearchButton.addEventListener("click", handleDaumPost);
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const postCode = postCodeInput.value;
  let address = addressInput.value;
  let detailAddress = detailAddressInput.value || "";

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;
  const isPostCodeValid = postCode.length === 5;
  const isAddressValid = address.length >= 2;

  if (!isFullNameValid || !isPasswordValid) {
    return alert("이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.");
  }

  if (!isEmailValid) {
    return alert("이메일 형식이 맞지 않습니다.");
  }

  if (!isPasswordSame) {
    return alert("비밀번호가 일치하지 않습니다.");
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
    const data = {
      fullName,
      email,
      password,
      postCode,
      address,
      loginMethod: "NOMAL",
    };

    await Api.post("/api/register", data);

    alert(`정상적으로 회원가입되었습니다.`);

    // 회원가입 후 자동 로그인 진행
    const loginData = { email, password };
    const { userToken, user } = await Api.post("/api/login", loginData);
    const { isAdmin, loginMethod } = user;

    localStorage.setItem("token", userToken);
    localStorage.setItem("isAdmin", isAdmin);
    localStorage.setItem("loginMethod", loginMethod);

    window.location.href = "/";
  } catch (err) {
    console.error(err.stack);
    alert(`error: ${err.message}`);
  }
}

async function handleEmailCheck(e) {
  e.preventDefault();
  const email = emailInput.value;
  const isEmailValid = validateEmail(email);
  if (!isEmailValid) {
    return alert("이메일 형식이 맞지 않습니다.");
  }
  try {
    const { isExist } = await Api.get(`/api/email/${email}`);
    if (isExist) {
      emailInput.value = "";
      return alert("중복된 이메일입니다.");
    }
  } catch (err) {
    console.error(err.stack);
    alert(`error: ${err.message}`);
  }
  alert("사용 가능한 이메일입니다.");
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
