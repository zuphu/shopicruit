// Render HTML with a receipt for an order
function receipt(order) {
  var p = 'Payment info: ';
    
  if (!order || !order.payment_type) {
    return; // Return if undefined to prevent runtime errors 
  }

  if (order.payment_type == "creditcard") { // changed conditional equality to assignment operator
    p += order.payment.getCardType + " " + order.payment.card_number; //card type(VISA/MasterCard etc.) and number)
  } else if (order.payment_type == "paypal") {
    p += order.payment.paypal_info;
  } else if (order.payment_type == "manual") {
    p += order.payment.manual_payment_info;
  } else if (order.payment_type == "free") {
    p += "This order was free!"; //Free order or promotional item
  } else {
    p += order.payment.default_payment_info;//default order info
  }
  
  if (order.payment_type != "free") {
     p += "<p> was charged " + order.amount_in_dollars + "$" + "</p>";
  }
 
  var html = "<h1> Order receipt details </h1>" +
            "<p> Your order of " + order.products.name + " has been received </p>" +  
            "<p>" + p + "</p>";

  document.write(html);
}