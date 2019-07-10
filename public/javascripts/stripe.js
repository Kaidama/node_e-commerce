$(() => {
    Stripe.setPublishableKey('pk_test_B0onpbz6dgj5eD4DoFe08TlP00QcfJGH5D')

    stripeResponseHandler = (status, response) =>{
        let $form = $('#payment-form')

        if(response.error){
            console.log(`Stripe error: ${ response.error.message }` );
            
            debugger 

            $form.find('.payment-errors').text(response.error.message)
            $form.find('#cardSubmit').prop('disabled', false)
        } else {
            console.log(response)
            let token = response.id

            $form.append($('<input type="hidden" name="stripeToken" />').val(token))

            $form.get(0).submit()
        }
    }

    $('#payment-form').submit((event) => {
        let $form = $(this)
       
        
        
        let cardNumber = $('#card-number').val()
        let cvcCode = $('#cvc-code').val()
        let expMonth = $('#card-expiry-month-year').val().slice(0, 2)
        let expYear = $('#card-expiry-month-year').val().slice(2, 4)
        console.log('asdfasdf')

        
        $form.find('#card-submit').prop('disabled', true)

        Stripe.card.createToken({
            number: cardNumber,
            cvc: cvcCode,
            exp_month: expMonth,
            exp_year: expYear
        }, stripeResponseHandler)

        console.log(`cardnumber: `, cardNumber);
        console.log(`cvcCode: `, cvcCode);
        console.log(`expMonth: `, expMonth);
        console.log(`expYear: `, expYear);

        return false
    })
})