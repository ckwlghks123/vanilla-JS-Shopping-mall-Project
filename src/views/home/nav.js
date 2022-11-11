// 요소(element), input 혹은 상수
const navbarUl = document.querySelector('#navbar');
const loginLi = document.querySelector('#navbar__login');
const registerLi = document.querySelector('#navbar__register');
const myPageLi = document.querySelector('#navbar__mypage');
const adminLi = document.querySelector('#navbar__admin');
const categoryLi = document.querySelector('#navbar__category');
const productLi = document.querySelector('#navbar__product');
const orderLi = document.querySelector('#navbar__order');

addAllEvents();

// 로그인 상태일 경우 헤더 GUI 변경. (로그인 / 회원가입 ⇒ 로그아웃)
export function insertLogoutLi() {
    if (localStorage.getItem('token')) {
        const logoutLi = document.createElement('li');
        const logoutA = document.createElement('a');
        logoutLi.id = 'navbar__logout';
        logoutA.href = '/';
        logoutA.innerText = '로그아웃';
        logoutLi.appendChild(logoutA);
        navbarUl.removeChild(loginLi);
        navbarUl.removeChild(registerLi);
        navbarUl.insertBefore(logoutLi, navbarUl.lastChild);
    }
}

// 로그아웃 버튼을 누를 경우 세션 스토리지의 토큰, isAdmin을 없애고 홈 경로로 이동
// navbar Li 를 클릭시 각 연결된 페이지로 이동
export function loginLogoutHandler(event) {
    event.preventDefault();
    switch (event.target.parentNode.id) {
        case 'navbar__logout':
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            adminLi.style.display = 'none';
            document.location.href = '/';
            break;
        case 'navbar__login':
            document.location.href = '/login';
            break;
        case 'navbar__register':
            document.location.href = '/register';
            break;
        case 'navbar__mypage':
            document.location.href = '/mypage';
            break;
        case 'navbar__category':
            document.location.href = '/categories';
            break;
        case 'navbar__product':
            document.location.href = '/products';
            break;
        case 'navbar__order':
            document.location.href = '/adminorders';
            break;
        case 'navbar__cart':
            document.location.href = '/cart';
            break;
        case 'navbar__menu':
            document.location.href = '/menu';
            break;
    }
}

export function insertMyPageLi() {
    if (localStorage.getItem('token')) {
        myPageLi.style.removeProperty('display');
    } else {
        myPageLi.style.display = 'none';
    }
}

// 현재 로그인한 유저가 admin일경우 관리자 Li 태그 보임
export function insertAdminLi() {
    if (localStorage.getItem('isAdmin') === 'true') {
        adminLi.style.removeProperty('display');
    } else if (localStorage.getItem('isAdmin') === 'false') {
        adminLi.style.display = 'none';
    }
}

// 현재 로그인한 유저가 admin일경우 카테고리 Li 태그 보임
export function insertCategoryLi() {
    if (localStorage.getItem('isAdmin') === 'true') {
        categoryLi.style.removeProperty('display');
    } else if (localStorage.getItem('isAdmin') === 'false') {
        categoryLi.style.display = 'none';
    }
}

// 현재 로그인한 유저가 admin일경우 상품 Li 태그 보임
export function insertProductLi() {
    if (localStorage.getItem('isAdmin') === 'true') {
        productLi.style.removeProperty('display');
    } else if (localStorage.getItem('isAdmin') === 'false') {
        productLi.style.display = 'none';
    }
}

// 현재 로그인한 유저가 admin일경우 주문 Li 태그 보임
export function insertOrderLi() {
    if (localStorage.getItem('isAdmin') === 'true') {
        orderLi.style.removeProperty('display');
    } else if (localStorage.getItem('isAdmin') === 'false') {
        orderLi.style.display = 'none';
    }
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
export function addAllEvents() {
    navbarUl.addEventListener('click', loginLogoutHandler);
}
