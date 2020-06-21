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
    $("#return-to-cart").click(function(){
       $("#checkout").modal("toggle")
       setTimeout(function(){
          $("#modal-cart").modal({
             toggle:true,
             focus:true
          })
         },400)
      })
    let buttonsShippingToCustomer=["#return-to-customer-info","#checkout-change-email","#checkout-change-address"]
    /*let problematicLinks=["#return-to-customer-info","#checkout-change-email","#checkout-change-address","#return-to-cart","#checkout-service-terms",
                          "#checkout-refund-policy"]
    eraseClick(problematicLinks)
    function eraseClick(elements){
        elements.forEach(function(element){
            $(element).off("click")
        })
    }*/
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

function getStorage(key = "data") {
   return JSON.parse(localStorage.getItem(key))
}

function saveStorage(key = "data", toSave = data) {
   localStorage.setItem(key, JSON.stringify(toSave))
}

/*E> DATA WORK*/
/******************************************************************************************************************************************************/
/*S> ADMIN CONTROL*/
let activeUser = JSON.parse(sessionStorage.getItem("logged-user")) || data.users[0] //This is just for debugging, by default it will be an empty object
sessionStorage.setItem("logged-user", JSON.stringify(activeUser))

function tryLogIn() {
   const name = $("#al_username")
   const pass = $("#al_password")

   let success = false
   let loggedUsername = {}

   for (const user of data.users) {
      if (user.name == name.val()) {
         success = true
         loggedUsername = user
      }
   }

   if (success) {
      if (loggedUsername.password == pass.val()) {
         activeUser = loggedUsername
         sessionStorage.setItem("logged-user", JSON.stringify(activeUser))
         drawProductList()
      } else {
         $(".apf_error").remove()
         pass.after(`<div class="apf_error alert alert-danger mt-1 p-1">Password is incorrect</div>`)
      }
   } else {
      $(".apf_error").remove()
      name.after(`<div class="apf_error alert alert-danger mt-1 p-1">Username not found</div>`)
   }
}

/*E> ADMIN CONTROL*/
/******************************************************************************************************************************************************/
/*S> DOCUMENT LOAD*/

$(document).ready(() => {
   //EVENT LISTENERS
   $(".manager-nav a").click(e => {
      if (!checkActiveUser()) return

      $(".manager-menu").hide()
      $("input, textarea").val("")
      $("" + e.target.getAttribute("data-href") + "").show()
   })

   $("#pl_btn").click(drawProductList)
   $("#ul_btn").click(drawUsers)

   $("#apf_btn").click(() => {
      if (!checkActiveUser()) return
      drawCategories()
      $("#add_product").children("h2").text("Add Product")
      $("#add_product_btn").text("Add Product")

      $("#add_product_btn").off()
      $("#add_product_btn").click(createProduct)
      $(".apf_product_color").checked = false
   })

   $("#btnCreateUser").click(e => {
      e.preventDefault()
      createUser()
   })

   $("#btnCreateCategory").click(e => {
      e.preventDefault()
      createCategory()
   })

   $("#al_login_btn").click(tryLogIn)
   $("#log_out_btn").click(() => {
      activeUser = {}
      checkActiveUser()
   })

   drawProductList()

   //ADMIN LOGIN CONTROL
   checkActiveUser()
})

/*E> DOCUMENT LOAD*/
/******************************************************************************************************************************************************/
/*S> DRAW ELEMENTS FUNCTIONS*/

function drawProductList() {
   if (!checkActiveUser()) return

   $(".manager-menu").hide()
   $(".pl_product").remove()
   $("#products_list").show()

   for (const prod of data.products) {
      $("#pl_list").append(`
        <tr class="no-bs-dark-2 pl_product">
            <td>${prod.id}</td>
            <td class="pl_name_column">${prod.name}</td>
            <td>${prod.price}</td>
            <td>${prod.stock}</td>
            <td><button type="button" class="btn btn-primary pl_edit_btn px-3 py-1" data-productId="${prod.id}">Edit</button></td>
            <td><button type="button" class="btn btn-danger pl_remove_btn px-3 py-1" data-productId="${prod.id}">Remove</button></td>
        </tr>`)
   }

   $(".pl_edit_btn").click(e => {
      const id = e.target.getAttribute("data-productId")
      showUpdateProduct(transformIdToObj(data.products, id))
   })

   $(".pl_remove_btn").click(e => {
      const id = e.target.getAttribute("data-productId")
      e.target.parentElement.parentElement.remove()
      data.products.splice(data.products.indexOf(transformIdToObj(data.products, id)), 1)
      saveStorage()
   })
}

function drawUsers() {
   if (!checkActiveUser()) return

   $(".ul_user").remove()
   $("#users_list").show()

   for (const user of data.users) {
      $("#ul_list").append(`
        <tr class="no-bs-dark-2 ul_user">
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><button type="button" class="btn btn-primary ul_edit_btn" data-userId="${user.id}">Edit</button></td>
            <td><button type="button" class="btn btn-danger ul_remove_btn px-3 py-1" data-userId="${user.id}">Remove</button></td>
        </tr>`)
      if (user.name == "admin") $(".ul_remove_btn").remove()
   }

   $(".ul_edit_btn").click(e => {
      const id = e.target.getAttribute("data-userId")
      showUpdateUser(transformIdToObj(data.users, id))
   })

   $(".ul_remove_btn").click(e => {
      const id = e.target.getAttribute("data-userId")
      e.target.parentElement.parentElement.remove()
      data.users.splice(data.users.indexOf(transformIdToObj(data.users, id)), 1)
      saveStorage()
   })
}

function drawCategories() {
   $(".apf_product_category").parent().remove()
   $(".apf_error").remove()

   if (data.categories.length == 0) {
      $("#apf_product_categories").append(`<div class="apf_error alert alert-danger mt-1 p-1">There are no categories created, 
        create one before adding a product</div>`)
   }

   let id = 0
   for (const cat of data.categories) {
      $("#apf_product_categories").append(`
        <div class="custom-control custom-checkbox p-1 ml-4  mr-3">
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

   for (const col of $(".apf_product_color"))
      if (searchForSameName(product.colors, col.name)) col.checked = true

   for (const cat of $(".apf_product_category"))
      if (searchForSameName(product.categories, cat.name)) cat.checked = true

   $("#add_product_btn").off()
   $("#add_product_btn").click(() => createProduct(product))
}


function showUpdateUser(user) {
   $(".manager-menu").hide()
   $("#create_user").show()

   $("#create_user").children("h2").text("Update User")
   $("#btnCreateUser").text("Save")
   drawUsers()

   $("#inputUserName").val(user.name)
   $("#inputUserEmail").val(user.email)
   $("#inputUserPass").val(user.password)

   $("#btnCreateUser").off()
   $("#btnCreateUser").click(() => {
      createUser(user)
   })

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
   const colors = $(".apf_product_color")
   const categories = $(".apf_product_category")

   let updatingProduct = false
   if (product.id !== undefined) updatingProduct = true

   //Checking if the form is correct and filled
   let validate = true
   $(".apf_error").remove()

   if (name.val().length < 3 || searchForSameName(data.products, name.val())) {
      //This doesn't have effect if admin is updating a product
      if (searchForSameName(data.products, name.val()) && !updatingProduct) {
         name.after(`<div class="apf_error alert alert-danger mt-1 p-1">There is a product already with this name</div>`)
         validate = false
      } else if (name.val().length == 0) {
         name.after(`<div class="apf_error alert alert-danger mt-1 p-1">Product name is required</div>`)
         validate = false
      } else if (name.val().length < 3) {
         name.after(`<div class="apf_error alert alert-danger mt-1 p-1">Product name has to be at least 3 characters</div>`)
         validate = false
      }
   }

   if (description.val().length < 6) {
      validate = false

      if (description.val().length == 0)
         description.after(`<div class="apf_error alert alert-danger mt-1 p-1">Description is required</div>`)
      else
         description.after(`<div class="apf_error alert alert-danger mt-1 p-1">Description has to be at least 6 characters</div>`)
   }

   if (img.val().length < 1 || img.val().split(",").length > 4) {
      validate = false

      if (img.val().length < 1)
         img.after(`<div class="apf_error alert alert-danger mt-1 p-1">An image is required</div>`)
      else
         img.after(`<div class="apf_error alert alert-danger mt-1 p-1">You only can upload up to 4 images</div>`)
   }

   if (price.val().length == 0 || price.val() <= 0) {
      validate = false

      if (price.val().length == 0)
         price.after(`<div class="apf_error alert alert-danger mt-1 p-1">Price is required</div>`)
      else
         price.after(`<div class="apf_error alert alert-danger mt-1 p-1">Price has to be bigger than 0</div>`)
   }

   if (stock.val().length == 0) {
      validate = false
      stock.after(`<div class="apf_error alert alert-danger mt-1 p-1">Stock is required</div>`)
   }

   if (weight.val().length == 0 || weight.val() <= 0) {
      validate = false

      if (weight.val().length == 0)
         weight.after(`<div class="apf_error alert alert-danger mt-1 p-1">Weight is required</div>`)
      else
         weight.after(`<div class="apf_error alert alert-danger mt-1 p-1">Weight has to be bigger than 0</div>`)
   }

   if (data.categories.length > 0) {
      if (!categories.is(":checked")) {
         validate = false
         categories.parent().parent().after(`<div class="apf_error alert alert-danger mt-1 p-1">Select at least 1 category</div>`)
      }
   } else {
      validate = false
      $("#apf_product_categories").append(`<div class="apf_error alert alert-danger mt-1 p-1">There are no categories created, 
        create one before adding a product</div>`)
   }

   if (!validate) return
   //VALIDATION DONE

   //Transform category checkbox to category object
   let selectedCategories = []
   for (const cat of categories)
      if (cat.checked) selectedCategories.push(categoryNameToObj(cat.name))

   //Transform color checkbox to color string
   let selectedColors = []
   for (const col of colors)
      if (col.checked) selectedColors.push(col.name)

   //FIRST PRODUCT INDEX HANDLER
   let lastProductId = 1
   if (data.products.length > 0)
      lastProductId = (data.products[data.products.length - 1].id) + 1
   if (updatingProduct) lastProductId = product.id

   //Product object creation
   const newProduct = {
      id: lastProductId,
      name: name.val(),
      description: description.val(),
      img: img.val().includes(",") ? img.val().trim().split(",") : img.val().trim(),
      price: price.val(),
      stock: stock.val(),
      weight: weight.val(),
      colors: selectedColors,
      categories: selectedCategories
   }

   if (updatingProduct) data.products[data.products.indexOf(product)] = newProduct
   else data.products.push(newProduct)
   saveStorage()

   //Returns to products menu
   $(".manager-menu").hide()
   drawProductList()
}

function createUser(user) {
   $(".apf_error").remove()

   const name = $("#inputUserName");
   const email = $("#inputUserEmail");
   const pass = $("#inputUserPass");

   let updatingUser = false
   try {
      if (user.id !== undefined) updatingUser = true
   } catch (e) {
      updatingUser = false
   }

   let validate = true

   if (name.val() == "" || name.val().length < 3 || searchForSameName(data.users, name.val())) {
      if (searchForSameName(data.products, name.val()))
         name.after('<div class="apf_error alert alert-danger mt-1 p-1">Username is taken</div>')
      else if (name.val().length < 3)
         name.after('<div class="apf_error alert alert-danger mt-1 p-1">Username has to be at least 3 characters long</div>')
      else
         name.after('<div class="apf_error alert alert-danger mt-1 p-1">Username is required</div>')

      validate = false
   }
   if (email.val() == "" || !email.val().includes("@")) {
      if (!email.val().includes("@"))
         email.after('<div class="apf_error alert alert-danger mt-1 p-1">Enter a valid email. Example: example@mail.com</div>')
      else
         email.after('<div class="apf_error alert alert-danger mt-1 p-1">Email is required</div>')

      validate = false
   }
   if (pass.val() == "" || pass.val().length < 8) {
      if (pass.val().length < 8)
         pass.after('<div class="apf_error alert alert-danger mt-1 p-1">Enter a valid password</div>')
      else
         pass.after('<div class="apf_error alert alert-danger mt-1 p-1">Password is required</div>')

      validate = false
   }

   if (!validate) return

   const newUser = {
      id: updatingUser ? user.id : (data.users[data.users.length - 1].id) + 1,
      name: name.val(),
      email: email.val(),
      password: pass.val()
   }
   if (updatingUser) data.users[data.users.indexOf(user)] = newUser
   else data.users.push(newUser)
   saveStorage()



   //Returns to products menu
   $(".manager-menu").hide()
   drawUsers()
}

function createCategory(category) {
   $(".apf_error").remove()

   const title = $("#inputCategoryTitle");
   const color = $("#selectCategoryColor");

   let updatingCategory = false

   try {
      if (category.id !== undefined) updatingCategory = true
   } catch (e) {
      updatingCategory = false
   }

   let validate = true

   if (title.val().length == 0 || searchForSameName(data.categories, title.val())) {

      if (searchForSameName(data.categories, title.val()))
         title.after('<div class="apf_error alert alert-danger mt-1 p-1">There is a category already with this name</div>')
      else
         title.after('<div class="apf_error alert alert-danger mt-1 p-1">Category name is required</div>')
      validate = false
   }

   if (color.val() == "Choose color...") {
      color.after('<div class="apf_error alert alert-danger mt-1 p-1">Category color is required</div>')
      validate = false
   }

   if (!validate) return

   let lastCategoryId = 1
   if (data.categories.length > 0)
      lastCategoryId = (data.categories[data.categories.length - 1].id) + 1
   if (updatingCategory) lastCategoryId = category.id

   const newCategory = {
      id: lastCategoryId,
      name: title.val(),
      color: color.val()
   }

   if (updatingCategory) data.categories[data.categories.indexOf(category)] = newCategory
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
   for (const cat of data.categories)
      if (cat.name == name) return cat
}

//Helper function to transform an id to object
function transformIdToObj(list, id) {
   for (const elem of list)
      if (elem.id == id) return elem
}

//Helper function to search for existent objects by name
function searchForSameName(list, name) {
   for (const elem of list)
      if (elem.name == name) return true
}

/*E> HELPER FUNCTIONS*/

function checkActiveUser() {
   if (Object.keys(activeUser).length == 0) {
      $(".manager-menu").hide()
      $("input").val("")
      $("#admin_login").show()
      return false
   } else return true
}

/*E> HELPER FUNCTIONS*/


/******************************************************************************************************************************************************/
/*S> PRINT PRODUCTS*/

/**
 * Print product cards in Gallery
 */
function printProducts() {
   const products = getStorage().products
   $(products).each(function (index, prod) {
      $("#product-result").append($(createProductCard(index, prod)).click(function () {
         createProductModal(prod)
      }))
   })

}

/**
 * Create product Card
 * @param {*Number} index 
 * @param {*Object} product 
 */
function createProductCard(index, product) {
   return `
   <div class="col-lg-${index > 1 ? "3" : "6"} col-md-4 col-sm-6" data-toggle="modal" data-target="#modal-product">
      <div class="card card-item my-3 no-bs-dark-3">
         <div class="image__container" style="background-image: url('${product.img[0]}')">
         </div>
         <div class="card-header">
            <h5 class="card-title line-clamp" title="${product.name}">${product.name}</h5>
            <p class="card-text">${product.price} €</p>
         </div>
      </div>
   </div>`
}

/**
 * Insert product data in modal
 * @param {*Object} product 
 */
function createProductModal(product) {
   //reset button
   $("#add-to-cart").text("Add to cart").removeClass("btn-success").addClass("btn-primary").off()
   $("#product-name").text(product.name)
   $("#product-description").empty()
   $("#product-description").append(`
   <p><b>Description:</b></p>
   <p>${product.description}</p>`)
   $("#product-price").text(product.price + " €")
   $("#product-quantity").val("1").attr("max", product.stock)
   createProductGallery(product)
   createColorOptions(product)
   $("#add-to-cart").off().click(function () {
      product.quantity = parseInt($("#product-quantity").val())
      product.colorSelected = $('[name="color-option"]:checked').val()
      addToCart(product)
      $("#add-to-cart").off().text("Go to cart").removeClass("btn-primary").addClass("btn-success").click(function () {
         $("#modal-product").modal("toggle")
         $("#modal-cart").modal("toggle")
         $("#add-to-cart").off()
      })
   })
}

/**
 * Create product carousel gallery
 * @param {*Object} product 
 */
function createProductGallery(product) {
   $("#product-gallery-pics").empty()
   $("#product-gallery-indicators").empty()
   $(product.img).each(function (index, img) {
      $("#product-gallery-pics").append(`
      <div class="carousel-item ${index == 0 ? "active" : ""}">
         <img class=" w-100"
         src="${img}"
         alt="${product.name} img ${index}">
      </div>
      `)
      $("#product-gallery-indicators").append(`
      <li data-target="#carousel-thumb" data-slide-to="${index}" class="active">
      </li>
      `)
   })

}

/**
 * Create product color options
 * @param {*Object} product 
 */
function createColorOptions(product) {
   $("#product-colors-list").empty()
   if (product.colors.length) {
      for (const color of product.colors) {
         let inputRadio = $(`<input class="d-none" type="radio" name="color-option" id="option-${color}" value="${color}">`)
         if (color == product.colors[0]) {
            inputRadio.attr('checked', true)
         }
         let colorItem = $(`<label class="product-colors" for="option-${color}"></label>`)
         colorItem.css("background-color", `${color}`)
         $("#product-colors-list").append(inputRadio).append(colorItem)
      }
   } else {
      let inputRadio = $(`<input class="d-none" type="radio" name="color-option" id="option-unique" value="Unique option" checked>`)
      let colorItem = $(`<label for="option-unique">Unique option</label>`)
      $("#product-colors-list").append(inputRadio).append(colorItem)
   }
}

/*E> HELPER FUNCTIONS*/
/**
 * Add product to cart in localStorage
 * @param {*Object} product 
 */
function addToCart(product) {
   let cart = getStorage("cart") || []

   if (findInCart(product) >= 0) {
      cart[findInCart(product)].quantity += product.quantity
   } else cart.push(product)
   saveStorage("cart", cart)
   printCart()
}

/**
 * Print products saved in the cart
 */
function printCart() {
   $("#cart-product-list").empty()
   let cart = getStorage("cart") || []

   if (!cart || cart.length == 0) {
      $("#cart-product-list").html("<h5>Add something to your cart</h5>")
      return
   }

   $(cart).each(function(index, product){
   // for (const product of cart) {
      let cartProduct = $(`<div class="d-flex flex-row card card-item mb-1 p-1" id="product-cart-${index}"></div >`)
      let cartImage = $('<div/>').addClass("col-6 p-1 cart-product-image").css('background-image', `url("${product.img[0]}")`)
      let cartData = $('<div class="col-6 p-1 cart-data"></div>')
      cartData.append(`<h5 class="line-clamp mb-1" title="${product.name}">${product.name}</h5>`)
      cartData.append(`<p class="card-text mb-1">Price <b><span data-price="${product.name}">${product.price}</span>€</b></p>`)
      cartData.append(`<label for="cart-product-quantity-${findInCart(product)}"><b>Quantity:</b> </label>`)
      cartData.append($(`<input type="number" id="cart-product-quantity-${findInCart(product)}" min="1" max="${product.stock}" step="1" value="${product.quantity}">`)
         .change(function () {
            product.quantity = parseInt($(this).val())
            updateinCart(product)
         })
      )
      cartData.append(`<p class="mb-1">Color: ${product.colorSelected}</p>`)
      cartData.append($(`<button type="button" class="btn btn-sm btn-danger my-2">Remove</button>`).click(() => {
         cartProduct.remove()
         removeFromCart(product)
      }))
      cartProduct.append(cartImage).append(cartData)
      $("#cart-product-list").append(cartProduct)
   })
   updateTotalPrice()

}

/**
 * Find product position in cart (localStorage)
 * @param {*Object} product 
 */
function findInCart(product) {
   let cart = getStorage("cart") || []
   return cart.map(function (e) {
      if (parseInt(e.id) == parseInt(product.id) && e.colorSelected == product.colorSelected) return e.id
   }).indexOf(product.id)

}

/**
 * Remove product from cart in LocalSotage
 * @param {*Object} product 
 */
function removeFromCart(product) {
   let cart = getStorage("cart")

   cart.splice(findInCart(product), 1)
   saveStorage("cart", cart)
   if (cart.length == 0)
      $("#cart-product-list").html("<h5>Add something to your cart</h5>")
   updateTotalPrice()

}

/**
 * Update product quantity in localstorage
 * @param {*Object} product 
 */
function updateinCart(product) {
   let cart = getStorage("cart")
   if (findInCart(product) >= 0) {

      cart[findInCart(product)].quantity = product.quantity
      saveStorage("cart", cart)
   }
   updateTotalPrice()
}

/**
 * Update shipping price and total price according to selected products
 */
function updateTotalPrice() {
   let cart = getStorage("cart")
   let totalWeight = 0
   let totalPrice = 0
   for (product of cart) {
      totalWeight += parseFloat(product.weight) * parseInt(product.quantity)
      totalPrice += parseFloat(product.price) * parseInt(product.quantity)
   }

   if (totalWeight <= 1) {
      $("#cart-shipping-price").text("Free")
      $("#cart-total-price").text((Math.round((totalPrice + Number.EPSILON) * 100) / 100) + "€")
   } else if (totalWeight > 1 && totalWeight <= 2) {
      $("#cart-shipping-price").text("10.90€")
      $("#cart-total-price").text((Math.round(((totalPrice + 10.9) + Number.EPSILON) * 100) / 100) + "€")
   } else if (totalWeight > 2 && totalWeight <= 3) {
      $("#cart-shipping-price").text("12.85€")
      $("#cart-total-price").text((Math.round(((totalPrice + 12.85) + Number.EPSILON) * 100) / 100) + "€")
   } else if (totalWeight > 3) {
      $("#cart-shipping-price").text("16.60€")
      $("#cart-total-price").text((Math.round(((totalPrice + 16.6) + Number.EPSILON) * 100) / 100) + "€")
   }
}

//Move listener to listener section.
$("#cart-checkout").click(function(){
   checkProductAvailability()
})
$("#cart-checkout").click(function(){
   $("#modal-cart").modal("toggle")
   setTimeout(function(){
      $("#checkout").modal("toggle")
   },400)
})

function checkProductAvailability(){
   // debugger
   let cart = getStorage("cart")
   let products = getStorage().products
   
   $(cart).each(function(index, prodCart){
      // debugger
      let prodData = products.find((e)=> {if(e.id == prodCart.id) return e})
      if(parseInt(prodData.stock) == 0){
         alert($(`#product-cart-${index} button`).text())
         $(`#product-cart-${index} div`).next().append(`<div class="alert alert-danger w-100">Product not avilable (stock: ${prodData.stock})</div>`)
      }
      
   })

}


printProducts()
printCart()


/*E> PRINT PRODUCTS*/
