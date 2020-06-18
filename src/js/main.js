$(document).ready(() => {
    
    //EVENT LISTENERS
    $("a").click(e => {
        $(".manager-menu").hide()
        $("" + e.target.getAttribute("data-href") + "").show()
    })

    $("#add_product_btn").click(addProduct)

    //change style
    $("#shipping-info").fadeOut()
    showValidation($("#checkout-email"),"nice job!","is-valid","valid-feedback")
    showValidation($("#up-to-date").parent(),"cool!","is-valid","valid-feedback")
    showValidation($("#checkout-name"),"Hey, that's not valid","is-invalid","invalid-feedback")
    showValidation($("#checkout-phone"),"Hey, your phone is required to contact you","is-invalid","invalid-feedback")
    $("#customer-info form").submit(function(event){event.preventDefault()})
    $("#continue-to-shipping").click(function(event){
        alert("a")
        replace($("#customer-info"),$("shipping-info"))
    })
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

function replace(element,replace){
    element.fadeOut()
    replace.fadeIn()
}

/**
 * It creates feedback with the message and classFeedback and append it to the element, and add classElement to element
 * @param {*jqueryElement} element 
 * @param {*string} message 
 * @param {*string} classElement 
 * @param {*string} classFeedback 
 */
function showValidation(element,message,classElement,classFeedback){
    let feedback = $("<div class="+classFeedback+">"+message+"</div>")
    element.addClass(classElement).after(feedback)
}
