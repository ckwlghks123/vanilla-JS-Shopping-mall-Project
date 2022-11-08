// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
/**
 * @detail: 지금까지 작성된 코드는 nav와 관련된 코드로, 다른 페이지에서도 현재 js 파일과
 * home.html파일의 navbar 부분이 사용될 수 있습니다.
 * @editor: 김상현
 * @date: 2022-11-05
 */

import * as Api from '/api.js';
import {
    insertLogoutLi,
    insertMyPageLi,
    insertAdminLi,
    insertCategoryLi,
    insertProductLi,
    insertOrderLi,
} from './nav.js';

addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
    insertLogoutLi();
    insertMyPageLi();
    insertAdminLi();
    insertCategoryLi();
    insertProductLi();
    insertOrderLi();
}
