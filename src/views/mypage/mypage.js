/**
 * @author: 김상현
 * @date: 2022-11-08
 * @detail: 마이페이지를 위한 js파일입니다.
 */

import * as Api from '/api.js';
import {
    insertLogoutLi,
    insertMyPageLi,
    insertAdminLi,
    insertCategoryLi,
    insertProductLi,
    insertOrderLi,
} from '../home/nav.js';

const userAdmin = document.querySelector('#user-admin');
const userName = document.querySelector('#user-name');
const userEmail = document.querySelector('#user-email');
const userCurrentPassword = document.querySelector('#user-current-password');
const userNewPassword = document.querySelector('#user-new-password');
const userPostCode = document.querySelector('#user-postcode');
const userAddress = document.querySelector('#user-address');
const userDetailAddress = document.querySelector('#user-detail-address');
const postCodeSearchButton = document.querySelector('#postCodeSearchButton');
const userInfoEditButton = document.querySelector('#user-info-edit-button');
const userWithdrawButton = document.querySelector('#user-withdraw-button');

addAllElements();
addAllEvents();

async function addAllElements() {
    insertLogoutLi();
    insertMyPageLi();
    insertAdminLi();
    insertCategoryLi();
    insertProductLi();
    insertOrderLi();
    // 위에까지 nav
    insertUserInfo();
}

function addAllEvents() {
    postCodeSearchButton.addEventListener('click', daumPostHandler);
    userInfoEditButton.addEventListener('click', editUserInfoHandler);
    userWithdrawButton.addEventListener('click', withdrawUserHandler);
}

// 유저 정보(isAdmin, 이름, 이메일, 주소, 우편번호) 조회 및 화면에 표시
async function insertUserInfo() {
    const isLogin = localStorage.getItem('token');
    if (!isLogin) {
        // window.location.href = "/login";
        return alert('로그인한 유저만 사용할 수 있는 서비스입니다.');
    }
    try {
        const userInfo = await Api.get('/api/me');
        const { isAdmin, fullName, email, address, postCode } = userInfo;

        // 주소를 상세주소와 주소로 구분
        let tempAddress = address.split(', ');
        const address1 = tempAddress[0];
        const address2 = tempAddress[1];

        insertIsAdmin(isAdmin);
        insertUserName(fullName);
        insertUserEmail(email);
        insertUserAddress(address1);
        insertUserDetailAddress(address2);
        insertUserPostCode(postCode);
    } catch (err) {
        console.error(err.stack);
        alert(`error: ${err.message}`);
        // location.replace("/login");
    }
}

// 관리자일때만 보이는 요소들 랜더링
function insertIsAdmin(isAdmin) {
    if (isAdmin) {
        userAdmin.style.removeProperty('display');
    } else {
        userAdmin.style.display = 'none';
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
            let address = '';

            if (data.userSelectedType === 'R') {
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
    const isNormal = localStorage.getItem('loginMethod') === 'NOMAL' ? true : false;

    if (!isNormal) {
        try {
            const user = await Api.get('', 'api/me');
            const { password } = user;
            // 소셜로그인이고 패스워드가 없으면 패스워드를 설정하라고 한다.
            if (!password) {
                alert('소셜계정으로 유저정보를 변경하려면 비밀번호를 설정해야합니다.');
                const userInputPassword = prompt('비밀번호를 입력하세요.');
                if (!userInputPassword) {
                    return;
                }
                if (userInputPassword.length < 4) {
                    return alert('비밀번호는 4글자 이상이어야 합니다.');
                }
                const userInputPassword2 = prompt('비밀번호를 한번 더 입력하세요.');
                if (userInputPassword !== userInputPassword2) {
                    return alert('비밀번호가 일치하지 않습니다.');
                }
                const data = { password: userInputPassword };
                await Api.patch('', 'api/user/password', data);
                return alert('비밀번호가 설정되었습니다.');
            }
        } catch (err) {
            console.error(err.stack);
            alert(`error: ${err.message}`);
        }
    }

    if (confirm('회원정보를 수정하시겠습니까?')) {
        try {
            const fullName = userName.value;
            const currentPassword = userCurrentPassword.value;
            const password = userNewPassword.value;
            const postCode = userPostCode.value;
            const address = userAddress.value + ', ' + userDetailAddress.value;

            const data = { fullName, currentPassword, password, postCode, address };

            const updatedUserInfo = await Api.patch('', 'api/user', data);

            userCurrentPassword.value = null;
            userNewPassword.value = null;
            alert('회원정보가 변경되었습니다.');
        } catch (err) {
            console.error(err.stack);
            alert(`error: ${err.message}`);
        }
    }
}

// 회원탈퇴 (DB에서 회원정보 삭제함)
async function withdrawUserHandler(e) {
    const isWithdraw = confirm('정말 회원 탈퇴를 하시겠습니까?');
    if (isWithdraw) {
        const password = prompt('회원탈퇴를 하려면 비밀번호를 입력하세요');
        try {
            const data = { password };
            const user = await Api.post('/api/signout', data);
            alert('회원탈퇴가 완료되었습니다.');
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            document.location.href = '/';
        } catch (err) {
            console.error(err.stack);
            alert(`error: ${err.message}`);
        }
    }
}
