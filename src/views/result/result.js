import * as Api from "/api.js";
import {
    insertLogoutLi,
    insertMyPageLi,
    insertAdminLi,
    insertCategoryLi,
    insertProductLi,
    insertOrderLi,
  } from '../home/nav.js';
  
  addAllElements();
  async function addAllElements() {
    insertLogoutLi();
    insertMyPageLi();
    insertAdminLi();
    insertCategoryLi();
    insertProductLi();
    insertOrderLi();
  
  }

  