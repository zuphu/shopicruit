// Render HTML with a receipt for an order
// Arguments: order {object}
function receipt(order) {
  var p = 'Payment info: ';

  //add a check to prevent run time errors if values are undefined
  if (!order || || !order.payment || !order.payment_type) {
    return;
  }

  if (order.payment_type === "creditcard" && order.payment.getCardType &&
      order.payment.card_number) {
    p = order.payment.getCardType + " " + order.payment.card_number; //card type(VISA/MasterCard etc.) and number)
  } else if (order.payment_type === "paypal" && order.payment.paypal_info) {
    p = order.payment.paypal_info;
  } else if (order.payment_type === "manual" && order.payment.manual_payment_info) {
    p = order.payment.manual_payment_info;
  } else if (order.payment_type === "free") {
    p = "This order was free!"; //Free order or promotional item
  } else if (order.payment.default_payment_info) {
    p = order.payment.default_payment_info;//default order info
  } else {
    p = 'Order type is invalid.'
    document.write(p);
    return;
  }

  if (order.payment_type !== "free" && order.amount_in_dollars) {
     p += "<p> was charged " + order.amount_in_dollars + "$" + "</p>";
  }
 
  var html = "<h1> Order receipt details </h1>" +
            "<p> Your order of " + order.products.name + " has been received </p>" +  
            "<p>" + p + "</p>";

  document.write(html);
}