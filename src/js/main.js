$(document).ready(() => {
    
    //EVENT LISTENERS
    $("a").click(e => {
        $(".manager-menu").hide()
        $("" + e.target.getAttribute("data-href") + "").show()
    })

    $("#add_product_btn").click(addProduct)

})


function addProduct() {
    const name = $("#apf_product_name")
    const description = $("#apf_product_description")
    const img = $("#apf_product_image")
    const price = $("#apf_product_price")
    const stock = $("#apf_product_stock")
    const color = $("#apf_product_color")

    //Checking if the form is correct and filled
    
}





const data= {
    product:[
        {
            title:"a",
            price:01,
            color:"z",
        },
        {
            title:"b",
            price:02,
            color:"r",
        },
        {
            title:"",
            price:0,
            color,
        },
        {
            title:"",
            price:0,
            color,
        },
        {
            title:"",
            price:0,
            color,
        },
        {
            title:"",
            price:0,
            color,
        },
    ],
    users:[
        {
            name:"1",
            email:"1",
            id:01,
            
        },
        {
            name:"2",
            email:"2",
            id:02,
            
        },
        {
            name:"3",
            email:"3",
            id:03,
            
        },
    ]
}








let objExample = {
    value:"hola"
}

function saveLocalStorage(key, obj){
    let arr = [];
    if(localStorage.getItem(key) === null) {
        arr.push(obj);
        localStorage.setItem(key, JSON.stringify(arr));
      } else {
        // let arr = JSON.parse(localStorage.getItem(key));
        // arr.push(obj);
        // localStorage.setItem(key, JSON.stringify(arr));
      }
}

// function editLocalStorage(){

// }
















