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
let activeUser = JSON.parse(sessionStorage.getItem("logged-user")) || {} //User: admin, pass: admin
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

         $("#log_out_btn").show()
         $('#sidebar, #sidebarCollapse').toggleClass('active')
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
   $('#sidebarCollapse').on('click', function() {
      $('#sidebar, #sidebarCollapse').toggleClass('active');
   });

   $(".manager-nav a").click(e => {
      if (!checkActiveUser()) return

      resetForm()
      $(".manager-menu").hide()
      $("" + e.target.getAttribute("data-href") + "").show()
   })

   $("#pl_btn").click(drawProductList)
   $("#ul_btn").click(drawUsers)
   $("#cl_btn").click(drawCategoryList)

   $("#apf_btn").click(() => {
      drawCategories()
      $("#add_product").children("h2").text("Add Product")
      $("#add_product_btn").text("Add Product")

      $("#add_product_btn").off()
      $("#add_product_btn").click(createProduct)
   })

   $("#acf_btn").click(() => {
      $("#add_category").children("h2").text("Create Category")
      $("#btnCreateCategory").text("Create")

      $("#btnCreateCategory").off()
      $("#btnCreateCategory").click(createCategory)
   })

   $("#auf_btn").click(() => {
      $("#create_user").children("h2").text("Create User")
      $("#btnCreateUser").text("Create")

      $("#btnCreateUser").off()
      $("#btnCreateUser").click(createUser)
   })

   $("#al_login_btn").click(tryLogIn)
   $("#log_out_btn").click(() => {
      resetForm()
      activeUser = {}
      checkActiveUser()
   })
   $("#log_in_btn").click(e => { 
      e.preventDefault()
      location.pathname = '/manager' 
   });

   //START
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

   $(".manager-menu").hide()
   $(".ul_user").remove()
   $("#users_list").show()

   for (const user of data.users) {
      $("#ul_list").append(`
        <tr class="no-bs-dark-2 ul_user">
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><button type="button" class="btn btn-primary px-3 py-1 ul_edit_btn " data-userId="${user.id}">Edit</button></td>
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

//Show the categories in the product form
function drawCategories() {
   $(".apf_product_category").parent().remove()
   $(".apf_error").remove()

   if (data.categories.length == 0) {
      $("#apf_product_categories").append(`<div class="apf_error alert alert-danger mt-1 p-1">There are no categories created, 
        create one before adding a product.</div>`)
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

//Generates a list of categories
function drawCategoryList() { 
   if (!checkActiveUser()) return

   $(".manager-menu").hide()
   $(".cl_category").remove()
   $("#categories_list").show()

   for (const cat of data.categories) {
      $("#cl_list").append(`
        <tr class="no-bs-dark-2 cl_category">
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td>${cat.color}</td>
            <td><button type="button" class="btn btn-primary cl_edit_btn px-3 py-1" data-catId="${cat.id}">Edit</button></td>
            <td><button type="button" class="btn btn-danger cl_remove_btn px-3 py-1" data-catId="${cat.id}">Remove</button></td>
        </tr>`)
   }

   $(".cl_edit_btn").click(e => {
      const id = e.target.getAttribute("data-catId")
      showUpdateCategory(transformIdToObj(data.categories, id))
   })

   $(".cl_remove_btn").click(e => {
      const id = e.target.getAttribute("data-catId")
      e.target.parentElement.parentElement.remove()
      data.categories.splice(data.categories.indexOf(transformIdToObj(data.categories, id)), 1)
      saveStorage()
   })
}

function showUpdateProduct(product) {
   if (!checkActiveUser()) return

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
   if (!checkActiveUser()) return

   $(".manager-menu").hide()
   $("#create_user").show()

   $("#create_user").children("h2").text("Update User")
   $("#btnCreateUser").text("Save")

   $("#inputUserName").val(user.name)
   $("#inputUserEmail").val(user.email)
   $("#inputUserPass").val(user.password)

   $("#btnCreateUser").off()
   $("#btnCreateUser").click(() => createUser(user))
}

function showUpdateCategory(cat) {
   if (!checkActiveUser()) return
   
   $(".manager-menu").hide()
   $("#add_category").show()

   $("#add_category").children("h2").text("Update Category")
   $("#btnCreateCategory").text("Save")

   $("#inputCategoryTitle").val(cat.name)
   $("#selectCategoryColor").val(cat.color)

   $("#btnCreateCategory").off()
   $("#btnCreateCategory").click(() => createCategory(cat))
}

/*E> DRAW ELEMENTS FUNCTIONS*/
/******************************************************************************************************************************************************/
/*S> CREATE OBJECT FUNCTIONS*/

function createProduct(product) {
   if (!checkActiveUser()) return

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
         name.after(`<div class="apf_error alert alert-danger mt-1 p-1">There is a product already with this name.</div>`)
         validate = false
      } else if (name.val().length == 0) {
         name.after(`<div class="apf_error alert alert-danger mt-1 p-1">Product name is required.</div>`)
         validate = false
      } else if (name.val().length < 3) {
         name.after(`<div class="apf_error alert alert-danger mt-1 p-1">Product name has to be at least 3 characters.</div>`)
         validate = false
      }
   }

   if (description.val().length < 6) {
      validate = false

      if (description.val().length == 0)
         description.after(`<div class="apf_error alert alert-danger mt-1 p-1">Description is required.</div>`)
      else
         description.after(`<div class="apf_error alert alert-danger mt-1 p-1">Description has to be at least 6 characters.</div>`)
   }

   if (img.val().length < 1 || img.val().split(",").length > 4) {
      validate = false

      if (img.val().length < 1)
         img.after(`<div class="apf_error alert alert-danger mt-1 p-1">An image is required.</div>`)
      else
         img.after(`<div class="apf_error alert alert-danger mt-1 p-1">You only can upload up to 4 images.</div>`)
   }

   if (price.val().length == 0 || price.val() <= 0) {
      validate = false

      if (price.val().length == 0)
         price.after(`<div class="apf_error alert alert-danger mt-1 p-1">Price is required.</div>`)
      else
         price.after(`<div class="apf_error alert alert-danger mt-1 p-1">Price has to be bigger than 0.</div>`)
   }

   if (stock.val().length == 0) {
      validate = false
      stock.after(`<div class="apf_error alert alert-danger mt-1 p-1">Stock is required.</div>`)
   }

   if (weight.val().length == 0 || weight.val() <= 0) {
      validate = false

      if (weight.val().length == 0)
         weight.after(`<div class="apf_error alert alert-danger mt-1 p-1">Weight is required.</div>`)
      else
         weight.after(`<div class="apf_error alert alert-danger mt-1 p-1">Weight has to be bigger than 0.</div>`)
   }

   if (data.categories.length > 0) {
      if (!categories.is(":checked")) {
         validate = false
         categories.parent().parent().after(`<div class="apf_error alert alert-danger mt-1 p-1">Select at least 1 category.</div>`)
      }
   } else {
      validate = false
      $("#apf_product_categories").append(`<div class="apf_error alert alert-danger mt-1 p-1">There are no categories created, 
        create one before adding a product.</div>`)
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
      name: name.val().replace(/"/g, '&quot;'),
      description: description.val().replace(/"/g, '&quot;'),
      img: img.val().includes(",") ? img.val().replace(" ", "").split(",") : [img.val().replace(" ", "")],
      price: parseFloat(price.val()),
      stock: parseInt(stock.val()),
      weight: parseFloat(weight.val()),
      colors: selectedColors,
      categories: selectedCategories
   }

   if (updatingProduct) data.products[data.products.indexOf(product)] = newProduct
   else data.products.push(newProduct)
   saveStorage()

   //Returns to products menu
   resetForm()
   $(".manager-menu").hide()
   drawProductList()
}

function createUser(user) {
   if (!checkActiveUser()) return

   const name = $("#inputUserName");
   const email = $("#inputUserEmail");
   const pass = $("#inputUserPass");

   let updatingUser = false
   try {
      if (user.id !== undefined) updatingUser = true
   } catch (e) { }

   let validate = true
   $(".apf_error").remove()

   if (name.val() == "" || name.val().length < 3 || searchForSameName(data.users, name.val())) {
      if (searchForSameName(data.products, name.val())) {
         validate = false
         name.after('<div class="apf_error alert alert-danger mt-1 p-1">Username is taken.</div>')
      }
      else if (name.val().length < 3) {
         validate = false
         name.after('<div class="apf_error alert alert-danger mt-1 p-1">Username has to be at least 3 characters long.</div>')
      }
      else if(name.val() == "") {
         validate = false
         name.after('<div class="apf_error alert alert-danger mt-1 p-1">Username is required.</div>')
      }
   }
   if (email.val() == "" || !email.val().includes("@")) {
      if (!email.val().includes("@"))
         email.after('<div class="apf_error alert alert-danger mt-1 p-1">Enter a valid email. Example: example@mail.com.</div>')
      else
         email.after('<div class="apf_error alert alert-danger mt-1 p-1">Email is required.</div>')

      validate = false
   }
   if (pass.val() == "" || pass.val().length < 8) {
      if (pass.val().length < 8)
         pass.after('<div class="apf_error alert alert-danger mt-1 p-1">Enter a valid password.</div>')
      else
         pass.after('<div class="apf_error alert alert-danger mt-1 p-1">Password is required.</div>')

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
   resetForm()
   $(".manager-menu").hide()
   drawUsers()
}

function createCategory(category) {
   if (!checkActiveUser()) return

   const title = $("#inputCategoryTitle");
   const color = $("#selectCategoryColor");

   let updatingCategory = false

   try {
      if (category.id !== undefined) updatingCategory = true
   } catch (e) { }

   let validate = true
   $(".apf_error").remove()

   if (title.val().length == 0 || searchForSameName(data.categories, title.val())) {

      if (searchForSameName(data.categories, title.val()))
         title.after('<div class="apf_error alert alert-danger mt-1 p-1">There is a category already with this name.</div>')
      else
         title.after('<div class="apf_error alert alert-danger mt-1 p-1">Category name is required.</div>')
      validate = false
   }

   if (color.val() == "Choose color...") {
      color.after('<div class="apf_error alert alert-danger mt-1 p-1">Category color is required.</div>')
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
   resetForm()
   $(".manager-menu").hide()
   drawCategoryList()
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
   for (const elem of list) {
      if(typeof elem == "object") {
         if (elem.name == name) return true
      } else if(typeof elem == "string") {
         if (elem == name) return true
      }   
   }
}

function checkActiveUser() {
   if (Object.keys(activeUser).length == 0) {
      $(".manager-menu").hide()
      $("#log_out_btn").hide()
      $(".vertical-nav").hide()
      resetForm()
      $("#admin_login").show()
      return false
   } else { 
      $(".vertical-nav").show()
      return true
   }
}

function resetForm() {
   document["addproduct"].reset();
   document["addcategory"].reset();
   document["createuser"].reset();
   document["login"].reset();
}

/*E> HELPER FUNCTIONS*/


/******************************************************************************************************************************************************/
/*S> PRINT PRODUCTS*/

/**
 * Print product cards in Gallery
 */
function printProducts(data) {
   addFilterOptions()
   $("#product-result").empty()
   let products
   if(!data) {
      products = getStorage().products
   }else{
      products = data
   }
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

/*E> PRINT PRODUCTS*/
/******************************************************************************************************************************************************/
/*S> SHOW PRODUCT - MODAL*/



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

/*E> SHOW PRODUCT MODAL*/


/******************************************************************************************************************************************************/
/*S> CART FUNCTIONS*/


/**
 * Add product to cart in localStorage
 * @param {*Object} product 
 */
function addToCart(product) {
   let cart = getStorage("cart") || []

   if (findInCart(product) >= 0) {
      cart[findInCart(product)].quantity += parseInt(product.quantity)
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

   $(cart).each(function (index, product) {
      // for (const product of cart) {
      let cartProduct = $(`<div class="d-flex flex-row mb-1 p-1" id="product-cart-${index}"></div >`)
      let cartImage = $('<div/>').addClass("col-6 p-1 cart-product-image").css('background-image', `url("${product.img[0]}")`)
      let cartData = $('<div class="col-6 p-1 cart-data"></div>')
      cartData.append(`<h5 class="line-clamp mb-1" title="${product.name}">${product.name}</h5>`)
      cartData.append(`<p class="mb-1">Price <b><span data-price="${product.name}">${product.price}</span>€</b></p>`)
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
      if (parseInt(e.id) == parseInt(product.id)) return e.id
      /**
       * if we wanted to show in the cart a product for each selected color 
       * it would be done this way but it would be necessary to modify 
       * the function that checks the stock
       */
      // if (parseInt(e.id) == parseInt(product.id) && e.colorSelected == product.colorSelected) return e.id
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

      cart[findInCart(product)].quantity = parseInt(product.quantity)
      cart[findInCart(product)].stock = product.stock
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
$("#cart-checkout").click(function () {
   checkProductAvailability()
})

/**
 * check availability of products before continuing with the purchase
 */
function checkProductAvailability() {
   let cart = getStorage("cart")
   let products = getStorage().products
   let goToCheckout = true

   $(cart).each(function (index, prodCart) {
      let prodData = products.find((e) => {
         if (e.id == prodCart.id) return e
      })
      if (parseInt(prodData.stock) == 0) {
         $(`#no-stock-${index}`).remove()
         $(`#product-cart-${index} div`).next().append(`<div id="no-stock-${index}" class="alert alert-danger w-100">Product not avilable (stock: ${prodData.stock}). Press remove this product to continue to checkout</div>`)
         prodCart.stock = parseInt(prodData.stock)
         updateinCart(prodCart)
         goToCheckout = false
      } else if (prodCart.quantity > parseInt(prodData.stock)) {
         $(`#no-quantity-${index}`).remove()
         $(`#product-cart-${index} div`).next().append(`<div id="no-quantity-${index}" class="alert alert-warning w-100">Your order exceeds the available quantity at this time: ${prodData.stock}. Press checkout to continue</div>`)
         $(`#cart-product-quantity-${index}`).val(parseInt(prodData.stock))
         prodCart.quantity = parseInt(prodData.stock)
         prodCart.stock = parseInt(prodData.stock)
         updateinCart(prodCart)
         goToCheckout = false
      } else if (prodCart.quantity > 0 && prodCart.quantity <= prodData.stock)
         $(`#no-quantity-${index}`).remove()

   })

   return goToCheckout
}

/*E> CART FUNCTIONS*/


/******************************************************************************************************************************************************/
/*S> CART FUNCTIONS*/


printProducts()
printCart()




/******************************************************************************************************************************************************/
/*S> SEARCH PRODUCTS*/

//Move listener to listener section.
$("#search-prod").keyup(function(){
   searchProduct($("#search-prod").val())
})

/**
 * Search products in the complete product list
 * @param {*String} val 
 */
function searchProduct(val){
   const products = getStorage().products
   let result = products.filter(function(e){
      if(e.name.toLowerCase().indexOf(val.toLowerCase()) > -1){
         return e
      }
   })
   printProducts(result)
}
/*E> SEARCH PRODUCTS*/

/******************************************************************************************************************************************************/
/*S> FILTER PRODUCTS BY CATEGORY*/

/**
 * Add filter options
 */
function addFilterOptions(){
   const options = getStorage().categories
   $("#filter-list").empty()
   $(options).each(function(index, category){
      $("#filter-list").append(`<option value="${category.name}">${category.name}</option>`)
   })
}

/**
 * Show products according selected category
 * @param {*String} val 
 */
function showFilterProducts(val){
   const products = getStorage().products
   let result = products.filter(function(e){
      for(const category of e.categories){
         if(category.name.toLowerCase().indexOf(val.toLowerCase()) > -1){
            return e
         }
      }
   })
   printProducts(result)
}

//Move listener to listener section.
$("#filter-category").change(function(){
   showFilterProducts($("#filter-category").val())
})

/*E> FILTER PRODUCTS BY CATEGORY*/