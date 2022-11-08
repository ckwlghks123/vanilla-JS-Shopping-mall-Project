/**
 * @author: 김상현
 * @date: 2022-11-08
 * @detail: 마이페이지를 위한 js파일입니다.
 */

import * as Api from "/api.js";

const userAdmin = document.querySelector("#user-admin");
const userName = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");
const userCurrentPassword = document.querySelector("#user-current-password");
const userNewPassword = document.querySelector("#user-new-password");
const userPostCode = document.querySelector("#user-postcode");
const userAddress = document.querySelector("#user-address");
const userDetailAddress = document.querySelector("#user-detail-address");
const postCodeSearchButton = document.querySelector("#postCodeSearchButton");
const userInfoEditButton = document.querySelector("#user-info-edit-button");
const userWithdrawButton = document.querySelector("#user-withdraw-button");
const usersInfoButton = document.querySelector("#users-info-button");

addAllElements();
addAllEvents();

async function addAllElements() {
  insertUserInfo();
}

function addAllEvents() {
  postCodeSearchButton.addEventListener("click", daumPostHandler);
  userInfoEditButton.addEventListener("click", editUserInfoHandler);
  userWithdrawButton.addEventListener("click", withdrawUserHandler);
  usersInfoButton.addEventListener("click", loadUsersInfoHandler);
}

// 유저 정보(isAdmin, 이름, 이메일, 주소, 우편번호) 조회 및 화면에 표시
async function insertUserInfo() {
  try {
    const userInfo = await Api.get("/api/me");
    const { isAdmin, fullName, email, address, postCode } = userInfo;

    // 주소를 상세주소와 주소로 구분
    let tempAddress = address.split(", ");
    const address1 = tempAddress[0];
    const address2 = tempAddress[1];
    console.log(address1);

    insertIsAdmin(isAdmin);
    insertUserName(fullName);
    insertUserEmail(email);
    insertUserAddress(address1);
    insertUserDetailAddress(address2);
    insertUserPostCode(postCode);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
    // location.replace("/login");
  }
}

// 관리자일때만 보이는 요소들 랜더링
function insertIsAdmin(isAdmin) {
  if (isAdmin) {
    userAdmin.style.removeProperty("display");
    usersInfoButton.style.removeProperty("display");
  } else {
    userAdmin.style.display = "none";
    usersInfoButton.style.display = "none";
  }
}

function insertUserName(fullName) {
  userName.value = fullName;
}

async function insertUserEmail(email) {
  userEmail.value = email;
}

function insertUserAddress(address1) {
  userAddress.value = address1;
}

function insertUserDetailAddress(address2) {
  userDetailAddress.value = address2;
}

function insertUserPostCode(postCode) {
  userPostCode.value = postCode;
}

function daumPostHandler(e) {
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
      userPostCode.value = data.zonecode;
      userAddress.value = address;
      // 커서를 상세주소 필드로 이동한다.
      userDetailAddress.focus();
    },
  }).open({
    left: window.screen.width / 2 - width / 2,
    top: window.screen.height / 2 - height / 2,
  });
}

// 유저 정보 변경
async function editUserInfoHandler(e) {
  if (confirm("회원정보를 수정하시겠습니까?")) {
    try {
      const fullName = userName.value;
      const currentPassword = userCurrentPassword.value;
      const password = userNewPassword.value;
      const postCode = userPostCode.value;
      const address = userAddress.value + ", " + userDetailAddress.value;

      const data = { fullName, currentPassword, password, postCode, address };

      const updatedUserInfo = await Api.patch("", "api/user", data);

      userCurrentPassword.value = null;
      userNewPassword.value = null;
      alert("회원정보가 변경되었습니다.");
    } catch (err) {
      console.error(err.stack);
      alert(
        `문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
      );
    }
  }
}

// 회원탈퇴 (DB에서 회원정보 삭제함)
async function withdrawUserHandler(e) {
  const isWithdraw = confirm("정말 회원 탈퇴를 하시겠습니까?");
  if (isWithdraw) {
    const password = prompt("회원탈퇴를 하려면 비밀번호를 입력하세요");
    try {
      const data = { password };
      const user = await Api.post("/api/signout", data);
      alert("회원탈퇴가 완료되었습니다.");
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      document.location.href = "/";
    } catch (err) {
      console.error(err.stack);
      alert(
        `문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
      );
    }
  }
}

// 관리자일때만 사용가능한 유저정보 콘솔로 불러오기
// (adminRequired 미들웨어가 잘 작동하는지 테스트 하기 위함)
async function loadUsersInfoHandler(e) {
  try {
    const users = await Api.get("", "api/userlist");
    console.log(users);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
