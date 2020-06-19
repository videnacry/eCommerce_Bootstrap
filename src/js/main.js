$(document).ready(() => {
    
    //EVENT LISTENERS
    $("a").click(e => {
        $(".manager-menu").hide()
        $("" + e.target.getAttribute("data-href") + "").show()
    })

    $("#add_product_btn").click(addProduct)

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


function addProduct() {
    const name = $("#apf_product_name")
    const description = $("#apf_product_description")
    const img = $("#apf_product_image")
    const price = $("#apf_product_price")
    const stock = $("#apf_product_stock")
    const color = $("#apf_product_color")

    //Checking if the form is correct and filled
    
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
