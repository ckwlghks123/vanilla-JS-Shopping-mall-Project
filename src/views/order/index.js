import * as Api from '/api.js';

const testdata1 = [
    {
        user: "elice0",
        product : "product0",
        address : "seoul",
        amount : 2,
        process: "WAIT",
        orderDate : "2022-10-31"
    },
    {
        user: "elice1",
        product : "product1",
        address : "seoul",
        amount : 3,
        process: "COMPLETED",
        orderDate : "2022-10-31"

    },
    {
        user: "elice2",
        product : "product2",
        address : "seoul",
        amount : 4,
        process: "INPROCESS",
        orderDate : "2022-10-31"

    },
]

let orderList = document.querySelector("#template");

//fetch api 호출 

//get
//데이터 갯수 만큼 노드 복제
let idNum = 0;
let testdataLength = 0;
const testDiv = document.querySelector('#template');

async function loadOrderList()  {

  const testdata = await Api.get('/api/orderlist');
  testdataLength = testdata.length;
  console.log("testsdata!",testdata.length,testdata);

  testdata.map((item)=>{
    
    console.log("생성",item)
    const newNode = testDiv.cloneNode(true);

    newNode.id = 'copyNode' + idNum;
    idNum++;
    document.querySelectorAll(".orderList")[0].after(newNode);
    //값 넣기 //한 사람이 여러개 샀다면 어뜨카지?
    newNode.querySelector(".user").textContent =item.user.fullName;
    newNode.querySelector(".product").textContent = item.list[0].product.name;
    newNode.querySelector(".orderPrice").textContent = item.list[0].product.price*item.list[0].amount;//product price
    newNode.querySelector(".orderDate").textContent = item.createdAt.split("T")[0];
    //옵션 - 배송상태
    let selectList = newNode.querySelectorAll(".process select option")
    selectList.forEach(select =>{
        if(select.value ===  item.process){
            select.selected = true
        }
    })

    if(testdata[idx].process!="COMPLETED"){
        newNode.querySelector("#deleteBtn").style.display = "none";
        // newNode.removeChild(newNode.querySelector("#deleteBtn").parentElement);
        // console.log("삭제버튼 안보임")
    }
    document.querySelector("#template").style.display = "none";

  })


}
loadOrderList();






//삭제 기능 - complete 일때만 삭제 버튼 보여야함
let deleteBtnList = document.querySelectorAll('#deleteBtn');
console.log(deleteBtnList)

function removeList(e) {
    console.log("e",e.target.parentElement.parentElement)
    if (confirm('주문 내역을 삭제하시겠습니까?')) {
        var li = e.target.parentElement.parentElement;
        document.querySelector("body").removeChild(li);
        console.log("삭제함")
        
        //데이터에서도 삭제
        deleteOrder() // 인자로 무엇을 넣어줘야하지
      }

  }
console.log(typeof deleteBtnList)
deleteBtnList.forEach(item=>{
    item.addEventListener('click',removeList)
})

async function deleteOrder(data){
    const result = await Api.delete('/api/admin/order', data);

}

//수정 기능
let changeBtnList = document.querySelectorAll('#changeBtn');

function reviseList(e){
    console.log("reviseList")
    
    console.log(e.target.parentElement.parentElement.querySelector(".user").textContent)

    testdata.map(item=>{
        if(item.user === e.target.parentElement.parentElement.querySelector(".user").textContent){
            console.log("이름 같음")
            e.target.parentElement.parentElement.querySelectorAll(".process select option").forEach(item2=>{
                if(item2.selected === true) item.process = item2.value; //testdata 넣어주기


                // 배송완료일 경우 삭제버튼 붙이기 - 
                if(item.process !== "COMPLETED"){
                    let deleteBtn2 = document.querySelectorAll('#template #deleteBtn');
                    e.target.parentElement.parentElement.querySelector("#deleteBtn").style.display ="none"
                }else{
                    e.target.parentElement.parentElement.querySelector("#deleteBtn").style.display ="block"
            
                }

            });

        }
    })

}
changeBtnList.forEach(item=>{ item.addEventListener('click',reviseList)})