if (self === top) {
    var antiClickjack = document.getElementById("antiClickjack");
    if (antiClickjack) antiClickjack.parentNode.removeChild(antiClickjack);
} else {
    top.location = self.location;
}
PaymentSession.configure({
    fields: {
        // ATTACH HOSTED FIELDS TO YOUR PAYMENT PAGE FOR A CREDIT CARD
        card: {
            number: "#card-number",
            securityCode: "#security-code",
            expiryMonth: "#expiry-month",
            expiryYear: "#expiry-year"
        }
    },
    //SPECIFY YOUR MITIGATION OPTION HERE
    frameEmbeddingMitigation: ["javascript"],
    callbacks: {
        initialized: function (response) {
            // HANDLE INITIALIZATION RESPONSE
        },
        formSessionUpdate: function (response) {
            // HANDLE RESPONSE FOR UPDATE SESSION
            if (response.status) {
                if ("ok" == response.status) {
                    //check if the security code was provided by the user
                    if (response.sourceOfFunds.provided.card.securityCode) {
                        console.log("Security code was provided.");
                    }
                    // Submit fields
                    var data = {
                        apiOperation: NodeSample.operation(),
                        sessionId: response.session.id,
                        transactionId: $('#transaction-id').val(),
                        orderId: $('#order-id').val(),
                        orderAmount: $('#order-amount').val(),
                        orderCurrency: $('#order-currency').val(),
                        orderDescription: $('#order-description').val(),
                        secureIdResponseUrl: NodeSample.secureIdResponseUrl()
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', NodeSample.endpoint(), true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == XMLHttpRequest.DONE) {
                            document.documentElement.innerHTML = this.response;
                        }
                    };
                    xhr.send(JSON.stringify(data));
                    console.log("Data: " + JSON.stringify(data));
                } else if ("fields_in_error" == response.status) {
                    console.log("Session update failed with field errors.");
                    if (response.errors.cardNumber) {
                        console.log("Card number invalid or missing.");
                    }
                    if (response.errors.expiryYear) {
                        console.log("Expiry year invalid or missing.");
                    }
                    if (response.errors.expiryMonth) {
                        console.log("Expiry month invalid or missing.");
                    }
                    if (response.errors.securityCode) {
                        console.log("Security code invalid.");
                    }
                } else if ("request_timeout" == response.status) {
                    console.log("Session update failed with request timeout: " + response.errors.message);
                } else if ("system_error" == response.status) {
                    console.log("Session update failed with system error: " + response.errors.message);
                }
            } else {
                console.log("Session update failed: " + response);
            }
        }
    }
});

function pay() {
    // UPDATE THE SESSION WITH THE INPUT FROM HOSTED FIELDS
    PaymentSession.updateSessionFromForm('card');
    // PaymentSession.onBlur(["card.number", "card.securityCode", "card.expiryYear", "card.expiryMonth"],

    //     function (selector, role)
    //     {
    //         PaymentSession.validate('card', function (allresult) {
    //             if (allresult.card[role].isValid) {
    //                 console.log("The field is valid");
    //                 document.querySelector(selector).style.borderColor = "green";
    //             } else {
    //                 console.log("The field is invalid");
    //                 document.querySelector(selector).style.borderColor = "red";
    //             }

    //         });

    //     });
}