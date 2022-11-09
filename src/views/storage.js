function getStorage(name, parse = true) {
  let item = null;
  try {
    item = parse
      ? JSON.parse(localStorage.getItem(name))
      : localStorage.getItem(name);
  } catch (e) {
    console.error("로컬스토리지 아이템을 가져오지 못했습니다.");
  }
  return item;
}

function setStorage(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function clearStorage(name) {
  localStorage.removeItem(name);
}

export { getStorage as get, setStorage as set, clearStorage as clear };
