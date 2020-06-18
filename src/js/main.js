$(document).ready(() => {
    //EVENT LISTENERS
    $("a").click(e => {
        $(".manager-menu").hide()
        $("" + e.target.getAttribute("data-href") + "").show()

        //Add product, update product
        $("#add_product").children("h2").text("Add Product")
        $("#add_product_btn").text("Add Product")
    })

    $("#apf_btn").click(() => { 
        drawCategories()
        $("#add_product").children("h2").text("Add Product")
        $("#add_product_btn").text("Add Product")
        $("#add_product_btn").click(addProduct)
    })
})

let data = getStorage() || {
    products: [],
    categories: [],
    users: []
}
saveStorage()

function addProduct(product) {
    const name = $("#apf_product_name")
    const description = $("#apf_product_description")
    const img = $("#apf_product_image")
    const price = $("#apf_product_price")
    const stock = $("#apf_product_stock")
    const weight = $("#apf_product_weight")
    const color = $("#apf_product_color")
    const categories = $(".apf_product_category")

    //Checking if the form is correct and filled
    let validate = true
    $(".apf_error").remove()

    if(name.val().length < 3) {
        validate = false

        if(name.val().length == 0)
            name.after(`<div class="apf_error alert alert-danger mt-1 p-1">Product name is required</div>`)
        else 
            name.after(`<div class="apf_error alert alert-danger mt-1 p-1">Product name has to be at least 3 characters</div>`)
    }

    if(description.val().length < 6) {
        validate = false

        if(description.val().length == 0)
            description.after(`<div class="apf_error alert alert-danger mt-1 p-1">Description is required</div>`)
        else 
            description.after(`<div class="apf_error alert alert-danger mt-1 p-1">Description has to be at least 6 characters</div>`)
    }

    if(img.val().length < 1 || img.val().split(",").length > 4) {
        validate = false

        if(img.val().length < 1)
            img.after(`<div class="apf_error alert alert-danger mt-1 p-1">An image is required</div>`)
        else 
            img.after(`<div class="apf_error alert alert-danger mt-1 p-1">You only can upload up to 4 images</div>`)
    }

    if(price.val().length == 0 || price.val() <= 0) {
        validate = false

        if(price.val().length == 0)
            price.after(`<div class="apf_error alert alert-danger mt-1 p-1">Price is required</div>`)
        else 
            price.after(`<div class="apf_error alert alert-danger mt-1 p-1">Price has to be bigger than 0</div>`)
    }

    if(stock.val().length == 0) {
        validate = false
        stock.after(`<div class="apf_error alert alert-danger mt-1 p-1">Stock is required</div>`)
    }

    if(color.val() == "Choose color...") {
        validate = false
        color.after(`<div class="apf_error alert alert-danger mt-1 p-1">A color is required</div>`)
    }

    if(weight.val().length == 0 || weight.val() <= 0) {
        validate = false

        if(weight.val().length == 0)
            weight.after(`<div class="apf_error alert alert-danger mt-1 p-1">Weight is required</div>`)
        else 
            weight.after(`<div class="apf_error alert alert-danger mt-1 p-1">Weight has to be bigger than 0</div>`)
    }

    if(data.categories.length > 0) {
        if(!categories.is(":checked")) {
            validate = false
            categories.parent().parent().after(`<div class="apf_error alert alert-danger mt-1 p-1">Select at least 1 category</div>`)
        }
    } else {
        validate = false
        $("#apf_product_categories").append(`<div class="apf_error alert alert-danger mt-1 p-1">There are no categories created, 
        create one before adding a product</div>`)
    }

    if(!validate) return
    //VALIDATION DONE
    
    //Transform category checkbox to strings
    let selectedCategories = []
    for(const cat of categories) if(cat.checked) selectedCategories.push(cat.name)

    //Product object creation
    let newProduct = {
        name: name.val(),
        description: description.val(),
        img: img.val().includes(",") ? img.val().trim().split(",") : img.val().trim(),
        price: price.val(),
        stock: stock.val(),
        weight: weight.val(),
        color: color.val(),
        categories: selectedCategories
    }   

    if(product !== undefined) data.products.splice(data.products.indexOf(product), 1)
    data.products.push(newProduct)
    saveStorage()

    //Returns to products menu
    $(".manager-menu").hide()
    $("#products_list").show()
}

function drawCategories() {
    $(".apf_product_category").remove()
    $(".apf_error").remove()

    if(data.categories.length == 0) {
        $("#apf_product_categories").append(`<div class="apf_error alert alert-danger mt-1 p-1">There are no categories created, 
        create one before adding a product</div>`)
    }

    let id = 0
    for(const cat of data.categories) {
        $("#apf_product_categories").append(`
        <div class="custom-control custom-checkbox p-1 ml-4">
            <input type="checkbox" class="custom-control-input apf_product_category" name="${cat}" id="apf_product_cat_${id}">
            <label class="custom-control-label" for="apf_product_cat_${id}">${cat}</label>
        </div>`)
        id++
    }
}

function showUpdateProduct(product) {
    $("#add_product").show()
    $("#add_product").children("h2").text("Update Product")
    $("#add_product_btn").text("Update Product")

    $("#apf_product_name").val(product.name)
    $("#apf_product_description").val(product.description)
    $("#apf_product_image").val(product.img)
    $("#apf_product_price").val(product.price)
    $("#apf_product_stock").val(product.stock)
    $("#apf_product_weight").val(product.weight)
    $("#apf_product_color").val(product.color)
    for(const cat of $(".apf_product_category")) if(product.categories.includes(cat.name)) cat.prop("checked")

    $("#add_product_btn").click(() => addProduct(product))
}

function getStorage() { 
    return JSON.parse(localStorage.getItem("data"))
}

function saveStorage() {
    localStorage.setItem("data", JSON.stringify(data))
}



/*OLD LOCAL STORAGE
function saveLocalStorage(key, obj){
    let arr = [];
    if(localStorage.getItem(key) === null) {
        arr.push(obj);
        localStorage.setItem(key, JSON.stringify(arr));
      } else {
        let arr = JSON.parse(localStorage.getItem(key));
        arr.push(obj);
        localStorage.setItem(key, JSON.stringify(arr));
      }
}
*/











