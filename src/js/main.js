$(document).ready(() => {
    //EVENT LISTENERS
    $("a").click(e => {
        $(".manager-menu").hide()
        $("input, textarea").val("")
        $("" + e.target.getAttribute("data-href") + "").show()
    })

    $("#pl_btn").click(drawProductList)
    $("#add_product_btn").click(addProduct)

    $("#apf_btn").click(() => { 
        drawCategories()
        $("#add_product").children("h2").text("Add Product")
        $("#add_product_btn").text("Add Product")
    })

    $("#btnCreateUser").click(e => {
        e.preventDefault()
        createUser()
    })

    $("#btnCreateCategory").click(e => {
        e.preventDefault()
        createCategory()
    })

    drawProductList()
})

let data = getStorage() || {
    products: [],
    categories: [],
    users: []
}

function getStorage() { 
    return JSON.parse(localStorage.getItem("data"))
}

function saveStorage() {
    localStorage.setItem("data", JSON.stringify(data))
}

function drawProductList() {
    $(".pl_product").remove()
    $("#products_list").show()

    let i = 1
    for(const prod of data.products) {
        $("#pl_list").append(`
        <tr class="no-bs-dark-2 pl_product">
            <td>${i}</td>
            <td>${prod.name}</td>
            <td>${prod.price}</td>
            <td>${prod.stock}</td>
            <td><button type="button" class="btn btn-primary pl_edit_btn" data-productId="${i}">Edit</button></td>
        </tr>`)
    }

    $(".pl_edit_btn").click(e => {
        const id = e.target.getAttribute("data-productId")
        showUpdateProduct(data.products[id-1])
    })
}

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
    for(const cat of categories) if(cat.checked) selectedCategories.push(categoryNameToObj(cat.name))

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

    if(product !== undefined) data.products.slice(data.products.indexOf(product), 1)
    data.products.push(newProduct)
    saveStorage()

    //Returns to products menu
    $(".manager-menu").hide()
    drawProductList()
}

function createUser()
{
    $(".apf_error").remove()

    let name = $("#inputUserName");
    let email = $("#inputUserEmail");
    let pass = $("#inputUserPass");

    let validate = true

    if(name.val() == "" || name.val().length < 3)
    {
        name.after('<div class="apf_error alert alert-danger mt-1 p-1">enter a valid name</div>')
        validate = false
    }
    if(email.val() == "")
    {
        email.after('<div class="apf_error alert alert-danger mt-1 p-1">enter a valid email example: example@mail.com</div>')
        validate = false
    }
    if(pass.val() == "" || pass.val().length < 8)
    {
        pass.after('<div class="apf_error alert alert-danger mt-1 p-1">enter a valid password</div>')
        validate = false
    }

    if(!validate) return

    let newUser = {
        name: name.val(),
        email: email.val(),
        password: pass.val()
    }

    data.users.push(newUser)
    saveStorage()

    //Returns to products menu
    $(".manager-menu").hide()
    drawProductList()
}

function createCategory()
{
    $(".apf_error").remove()

    const title = $("#inputCategoryTitle");
    const color = $("#selectCategoryColor");

    let validate = true

    if (title.val().length == 0){
        title.after('<div class="apf_error alert alert-danger mt-1 p-1">Category name is required</div>')
        validate = false
    }

    if(color.val() == "Choose color..."){
        color.after('<div class="apf_error alert alert-danger mt-1 p-1">Category color is required</div>')
        validate = false
    }

    if(!validate) return

    let newCategory = {
        title: title.val(),
        color: color.val()
    }

    data.categories.push(newCategory)
    saveStorage()

    //Returns to products menu
    $(".manager-menu").hide()
    drawProductList()
}


function drawCategories() {
    $(".apf_product_category").parent().remove()
    $(".apf_error").remove()

    if(data.categories.length == 0) {
        $("#apf_product_categories").append(`<div class="apf_error alert alert-danger mt-1 p-1">There are no categories created, 
        create one before adding a product</div>`)
    }

    let id = 0
    for(const cat of data.categories) {
        $("#apf_product_categories").append(`
        <div class="custom-control custom-checkbox p-1 ml-4">
            <input type="checkbox" class="custom-control-input apf_product_category" name="${cat.title}" id="apf_product_cat_${id}">
            <label class="custom-control-label" for="apf_product_cat_${id}">${cat.title}</label>
        </div>`)
        id++
    }
}

function showUpdateProduct(product) {
    $(".manager-menu").hide()
    $("#add_product").show()
    
    $("#add_product").children("h2").text("Update Product")
    $("#add_product_btn").text("Update Product")
    drawCategories()

    $("#apf_product_name").val(product.name)
    $("#apf_product_description").val(product.description)
    $("#apf_product_image").val(product.img)
    $("#apf_product_price").val(product.price)
    $("#apf_product_stock").val(product.stock)
    $("#apf_product_weight").val(product.weight)
    $("#apf_product_color").val(product.color)
    
    for(const cat of $(".apf_product_category"))
        if(searchMatchCategory(product, cat.name)) cat.checked = true
        
    $("#add_product_btn").click(() => addProduct(product))
}

//Helper function to transform category name to object
function categoryNameToObj(name) {
    for(const cat of data.categories) 
        if(cat.title == name) return cat
}

//Helper function to search for a category in a product
function searchMatchCategory(product, name) {
    for(const cat of product.categories)
        if(cat.title == name) return true
}

