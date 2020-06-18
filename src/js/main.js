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

