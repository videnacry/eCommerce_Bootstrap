/*S> DOCUMENT LOAD*/

$(document).ready(() => {
    //EVENT LISTENERS
    $("a").click(e => {
        $(".manager-menu").hide()
        $("input, textarea").val("")
        $("" + e.target.getAttribute("data-href") + "").show()
    })

    $("#pl_btn").click(drawProductList)
    $("#ul_btn").click(drawUsers)

    $("#apf_btn").click(() => { 
        drawCategories()
        $("#add_product").children("h2").text("Add Product")
        $("#add_product_btn").text("Add Product")

        $("#add_product_btn").off()
        $("#add_product_btn").click(createProduct)
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
    drawUsers()

    //change style
    $("#shipping-info").fadeOut()
    $("#customer-info form").submit(function(event){event.preventDefault()})
    $("#continue-to-shipping").click(function(){
        let rep = customerValidation()
        if(rep){
            replace($("#customer-info"),$("#shipping-info"))
        }
    })
    let buttonsShippingToCustomer=["#return-to-customer-info","#checkout-change-email","#checkout-change-address"]
    let problematicLinks=["#return-to-customer-info","#checkout-change-email","#checkout-change-address","#return-to-cart"]
    eraseClick(problematicLinks)
    function eraseClick(elements){
        elements.forEach(function(element){
            $(element).off("click")
        })
    }
    shippingToCustomer(buttonsShippingToCustomer)
    
    function customerValidation(){
        let email = $("#checkout-email")
        let val = email.val().trim()
        let errorCount = 0
        if(val.slice(-4)==".com"&&val.length-val.indexOf("@")>3){
            showValidation(email,"Well done!, thank you!","is-valid","valid-feedback")
        }
        else{
            showValidation(email,"Required!We can't detect the '.com' or '@', are they in their position?","is-invalid","invalid-feedback")
            errorCount++
        }
        let nombres = [$("#checkout-name"),$("#checkout-lastname"),$("#checkout-address"),$("#checkout-city"),$("#checkout-country"),
                       $("#checkout-province")]
        let messages = ["That's a good name!, thank you!","Nice lastname!, thank you!","Lovely place, thank you!","Wonderful city, thank you!",
                        "Thriving country, thank you!","Beautiful city, thank you!"]
        validateNames(nombres,messages)
        let phone = $("#checkout-phone")
        val = phone.val().trim()
        if(val.length==10&&val>1){
            showValidation(phone,"We would contact you in case it's needed for this purchase, thank you!","is-valid","valid-feedback")            
        }
        else{
            showValidation(phone,"Required!Unfortunately we can't accept special characters","is-invalid","invalid-feedback")
            errorCount++            
        }
        let postalCode = $("#checkout-postal-code")
        val = postalCode.val().trim()
        if(val.length==5&&val>1){
            showValidation(postalCode,"Luck number!, thank you!","is-valid","valid-feedback")            
        }
        else{
            showValidation(postalCode,"Required!Unfortunately we can't accept special characters","is-invalid","invalid-feedback")
            errorCount++            
        }
        if(errorCount>0){
            return false
        }
        else{
            return true
        }
        function validateNames(names,goodMessages){
            for(let i in names){
                let text = names[i].val().trim()
                let validation = validateCharacters(text)
                if(text.length>1&&validation.valid){
                    names[i].val(validation.text)
                    showValidation(names[i],goodMessages[i],"is-valid","valid-feedback")
                }
                else{
                    showValidation(names[i],"Required!Unfortunately we can't accept special characters","is-invalid","invalid-feedback")
                    errorCount++
                }  
            }
        }
    }

    /**
 * It fadeOut element and fadeIn replace
 * @param {jqueryElement} element 
 * @param {jqueryElement} replace 
 */
function replace(element,replace){
    element.fadeOut(500)
    setTimeout(function(){
        replace.fadeIn(500)
    },500)
}

/**
 * It creates feedback with the message and classFeedback and append it to the element, and add classElement to element
 * @param {*jqueryElement} element 
 * @param {*string} message 
 * @param {*string} classElement 
 * @param {*string} classFeedback 
 */
function showValidation(element,message,classElement,classFeedback){
    element.parent().children(".valid-feedback,.invalid-feedback").remove()
    element.removeClass("is-valid is-invalid")
    let feedback = $("<div class="+classFeedback+">"+message+"</div>")
    element.addClass(classElement).after(feedback)
}

    function shippingToCustomer(buttonsSelectors){
        buttonsSelectors.forEach(function(button){
            $(button).click(function(){
                replace($("#shipping-info"),$("#customer-info"))                
            })
        })
    }

    function validateCharacters(txt){
        let newText = txt.toLowerCase().replace(/á|é|í|ó|ú|ä|ë|ï|ö|ü|ñ/ig,function(str){
            let newStr = str=="á"||str=="ä"?"a":str=="è"||str=="ë"?"e":
            str=="í"||str=="ï"?"i":str=="ó"||str=="ö"?"o":str=="ú"||str=="ü"?"u":"n"
            return newStr
        })
        if(txt.indexOf("(")>0||txt.indexOf(")")>0||txt.indexOf(".")>0||txt.indexOf(",")>0||txt.indexOf("<")>0||
        txt.indexOf(">")>0||txt.indexOf(";")>0||txt.indexOf("@")>0||txt.indexOf(":")>0||txt.indexOf("Ç")>0||txt.indexOf("*")>0||
        txt.indexOf("%")>0||txt.indexOf("&")>0||txt.indexOf("\"")>0||txt.indexOf("+")>0||txt.indexOf("ª")>0||txt.indexOf("=")>0){
            console.log(newText)
            return {valid:false,text:newText.replace(/ /g,"")}
        }
        return {valid:true,text:newText.replace(/ /g,"")}
    }
})

/*E> DOCUMENT LOAD*/
/******************************************************************************************************************************************************/
/*S> DATA WORK*/

let data = getStorage() || {
    products: [],
    categories: [],
    users: [{
        id: 1,
        name: "admin",
        email: "admin@ecommerce.com",
        password: "admin"
    }]
}
saveStorage()

function getStorage() { return JSON.parse(localStorage.getItem("data")) }
function saveStorage() { localStorage.setItem("data", JSON.stringify(data)) }

/*E> DATA WORK*/
/******************************************************************************************************************************************************/
/*S> DRAW ELEMENTS FUNCTIONS*/

function drawProductList() {
    $(".pl_product").remove()
    $("#products_list").show()

    for(const prod of data.products) {
        $("#pl_list").append(`
        <tr class="no-bs-dark-2 pl_product">
            <td>${prod.id}</td>
            <td>${prod.name}</td>
            <td>${prod.price}</td>
            <td>${prod.stock}</td>
            <td><button type="button" class="btn btn-primary pl_edit_btn" data-productId="${prod.id}">Edit</button></td>
        </tr>`)
    }

    $(".pl_edit_btn").click(e => {
        const id = e.target.getAttribute("data-productId")
        showUpdateProduct(transformIdToObj(data.products, id))
    })
}

function drawUsers() {
    $(".ul_user").remove()
    $("#users_list").show()

    for(const user of data.users) {
        $("#ul_list").append(`
        <tr class="no-bs-dark-2 ul_user">
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><button type="button" class="btn btn-primary ul_edit_btn" data-userId="${user.id}">Edit</button></td>
        </tr>`)
    }

    $(".ul_edit_btn").click(e => {
        const id = e.target.getAttribute("data-userId")
        showUpdateUser(transformIdToObj(data.users, id))
    })
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
            <input type="checkbox" class="custom-control-input apf_product_category" name="${cat.name}" id="apf_product_cat_${id}">
            <label class="custom-control-label" for="apf_product_cat_${id}">${cat.name}</label>
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
        if(searchForSameName(product.categories, cat.name)) cat.checked = true
        
    $("#add_product_btn").off()
    $("#add_product_btn").click(() => createProduct(product))
}

/*E> DRAW ELEMENTS FUNCTIONS*/
/******************************************************************************************************************************************************/
/*S> CREATE OBJECT FUNCTIONS*/

function createProduct(product) {
    const name = $("#apf_product_name")
    const description = $("#apf_product_description")
    const img = $("#apf_product_image")
    const price = $("#apf_product_price")
    const stock = $("#apf_product_stock")
    const weight = $("#apf_product_weight")
    const color = $("#apf_product_color")
    const categories = $(".apf_product_category")
    
    let updatingProduct = false
    if(product.id !== undefined) updatingProduct = true

    //Checking if the form is correct and filled
    let validate = true
    $(".apf_error").remove()

    if(name.val().length < 3 || searchForSameName(data.products, name.val())) {
        //This doesn't have effect if admin is updating a product
        if(searchForSameName(data.products, name.val()) && !updatingProduct) {
            name.after(`<div class="apf_error alert alert-danger mt-1 p-1">There is a product already with this name</div>`)
            validate = false
        } else if(name.val().length == 0) {
            name.after(`<div class="apf_error alert alert-danger mt-1 p-1">Product name is required</div>`)
            validate = false
        } else if(name.val().length < 3) {
            name.after(`<div class="apf_error alert alert-danger mt-1 p-1">Product name has to be at least 3 characters</div>`)
            validate = false
        }
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

    
    //FIRST PRODUCT INDEX HANDLER
    let lastProductId = 1
    if(data.products.length > 0)
        lastProductId = (data.products[data.products.length - 1].id) + 1
    if(updatingProduct) lastProductId = product.id   
        
    //Product object creation
    const newProduct = {
        id: lastProductId,
        name: name.val(),
        description: description.val(),
        img: img.val().includes(",") ? img.val().trim().split(",") : img.val().trim(),
        price: price.val(),
        stock: stock.val(),
        weight: weight.val(),
        color: color.val(),
        categories: selectedCategories
    }    

    if(updatingProduct) data.products[data.products.indexOf(product)] = newProduct
    else data.products.push(newProduct)
    saveStorage()

    //Returns to products menu
    $(".manager-menu").hide()
    drawProductList()
}

function createUser(user)
{
    $(".apf_error").remove()

    const name = $("#inputUserName");
    const email = $("#inputUserEmail");
    const pass = $("#inputUserPass");

    let updatingUser = false
    try {
        if(user.id !== undefined) updatingUser = true
    } catch(e) { updatingUser = false }

    let validate = true

    if(name.val() == "" || name.val().length < 3 || searchForSameName(data.users, name.val()))
    {
        if(searchForSameName(data.products, name.val()))
            name.after('<div class="apf_error alert alert-danger mt-1 p-1">Username is taken</div>')
        else if(name.val().length < 3)
            name.after('<div class="apf_error alert alert-danger mt-1 p-1">Username has to be at least 3 characters long</div>')
        else 
            name.after('<div class="apf_error alert alert-danger mt-1 p-1">Username is required</div>')

        validate = false
    }
    if(email.val() == "" || !email.val().includes("@"))
    {
        if(!email.val().includes("@"))
            email.after('<div class="apf_error alert alert-danger mt-1 p-1">Enter a valid email. Example: example@mail.com</div>')
        else
            email.after('<div class="apf_error alert alert-danger mt-1 p-1">Email is required</div>')

        validate = false
    }
    if(pass.val() == "" || pass.val().length < 8)
    {
        if(pass.val().length < 8)
            pass.after('<div class="apf_error alert alert-danger mt-1 p-1">Enter a valid password</div>')
        else 
            pass.after('<div class="apf_error alert alert-danger mt-1 p-1">Password is required</div>')

        validate = false
    }

    if(!validate) return

    const newUser = {
        id: updatingUser ? user.id : (data.users[data.users.length - 1].id) + 1,
        name: name.val(),
        email: email.val(),
        password: pass.val()
    }

    if(updatingUser) data.users[data.users.indexOf(user)] = newUser
    else data.users.push(newUser)
    saveStorage()

    //Returns to products menu
    $(".manager-menu").hide()
    drawUsers()
}

function createCategory(category)
{
    $(".apf_error").remove()

    const title = $("#inputCategoryTitle");
    const color = $("#selectCategoryColor");

    let updatingCategory = false

    try{
        if(category.id !== undefined) updatingCategory = true
    } catch(e) { updatingCategory = false }

    let validate = true

    if (title.val().length == 0 || searchForSameName(data.categories, title.val())){

        if(searchForSameName(data.categories, title.val()))
            title.after('<div class="apf_error alert alert-danger mt-1 p-1">There is a category already with this name</div>')
        else
            title.after('<div class="apf_error alert alert-danger mt-1 p-1">Category name is required</div>')
        validate = false
    }

    if(color.val() == "Choose color..."){
        color.after('<div class="apf_error alert alert-danger mt-1 p-1">Category color is required</div>')
        validate = false
    }

    if(!validate) return

    let lastCategoryId = 1
    if(data.categories.length > 0)
        lastCategoryId = (data.categories[data.categories.length - 1].id) + 1
    if(updatingCategory) lastCategoryId = category.id   

    const newCategory = {
        id: lastCategoryId,
        name: title.val(),
        color: color.val()
    }

    if(updatingCategory) data.categories[data.categories.indexOf(category)] = newCategory
    else data.categories.push(newCategory)
    saveStorage()

    //Returns to products menu
    $(".manager-menu").hide()
    drawProductList()
}

/*E> CREATE OBJECT FUNCTIONS*/
/******************************************************************************************************************************************************/
/*S> HELPER FUNCTIONS*/

//Helper function to transform category name to object
function categoryNameToObj(name) {
    for(const cat of data.categories) 
        if(cat.name == name) return cat
}

//Helper function to transform an id to object
function transformIdToObj(list, id) {
    for(const elem of list)
        if(elem.id == id) return elem
}

//Helper function to search for existent objects by name
function searchForSameName(list, name) {
    for(const elem of list)
        if(elem.name == name) return true
}

/*E> HELPER FUNCTIONS*/
