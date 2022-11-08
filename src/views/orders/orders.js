import * as Api from "/api.js";

//get
//데이터 갯수 만큼 노드 복제
const testDiv = document.querySelector("#template");
const [WAIT, INPROGRESS, COMPLETED] = ["WAIT", "INPROGRESS", "COMPLETED"];
async function loadOrderList() {
  let idNum = 0;

  //다시로드 앞에 먼저 제거해조야되나? -> 안해줘도 삭제됨
  document.querySelectorAll(".copy").forEach(item=>{
      document.querySelector(".box").removeChild(item)
  })
  document.querySelector("#template").classList.add("on");


  const testdata = await Api.get("/api/orderlist");
  console.log("testsdata!", testdata.length, testdata);

  testdata.map((item) => {
    const newNode = testDiv.cloneNode(true);

    newNode.id = "copyNode" + idNum;
    newNode.className += " copy";
    if(idNum%2===0) newNode.className += " even"
    idNum++;
    document.querySelectorAll(".orderList")[0].after(newNode);
    //값 넣기 //한 사람이 여러개 샀다면 어뜨카지?
    newNode.querySelector(".user").textContent = item.user.fullName;

    //주문 목록, 결제 금액
    let [productName,orderPrice] = ["",0];
    item.list.map(i =>{
      productName += i.product.name +"</br>";
      orderPrice += i.product.price * i.amount;
    })
    newNode.querySelector(".product").innerHTML = productName;//item.list[0].product.name;

    newNode.querySelector(".orderPrice").textContent = orderPrice.toLocaleString('ko-KR');
      //item.list[0].product.price * item.list[0].amount; //product price
    newNode.querySelector(".orderDate").textContent =
      item.createdAt.split("T")[0];
    //옵션 - 배송상태
    let selectList = newNode.querySelectorAll(".process select option");
    selectList.forEach((select) => {
      if (select.value === item.process) {
        select.selected = true;
      }
    });
    if (item.process !== COMPLETED) {
      document.querySelector("#deleteBtn").classList.remove("on");

    }

    //삭제버튼에 삭제기능 추가
    newNode.querySelector("#deleteBtn").addEventListener("click", (e) => {
      if (confirm("주문 내역을 삭제하시겠습니까?")) {
        var li = e.target.parentElement.parentElement;
        document.querySelector(".box").removeChild(li);

        //데이터에서도 삭제
        deleteOrderList(item._id); 
        loadOrderList();
        
      }

    });

    //변경버튼에 변경기능 추가
    newNode.querySelector("#changeBtn").addEventListener("click",(e)=>{
    let changeProcess = ""
    //데이터에서 변경
    e.target.parentElement.parentElement.  //
      querySelectorAll(".process select option")
      .forEach(option => 
        {if(option.selected === true){
          switch(option.textContent){
            case "배송대기":
              changeProcess = WAIT;
              break;
            case "배송중":
              changeProcess = INPROGRESS;
              break;
            case "배송완료":
              changeProcess = COMPLETED;
              e.target.parentElement.parentElement.querySelector("#deleteBtn").classList.add("on");
              break;
          }
      }}) 
        changeOrderList(item._id,changeProcess)
        .catch(e=>{
          alert(`${e} \n배송완료의 경우, 배송 대기 혹은 배송중 상태로 돌아갈 수 없습니다`);
          loadOrderList();
        }
        )
    })

  });

  document.querySelector("#template").classList.remove("on");
}
loadOrderList();

//삭제 기능 - complete 일때만 삭제 버튼 보여야함
//데이터 삭제
async function deleteOrderList(data) {
    const result = await Api.delete('/api/order', data);
}
//수정 기능
async function changeOrderList(id,changeProcess){
  const process = changeProcess;
  const data = {process}
  const order = await Api.patch("",`api/order/${id}`,data);


}