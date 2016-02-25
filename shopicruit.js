/******************************************
Author: 	Anthony Guevara
Date: 		February 24, 2016
Purpose: 	Retrieve a list of items from shopifies shopicruit store. Parse
			the JSON data to retrieve Keyboard and Computer items. Calculate
the maximum number of items that can be carried with a maximum weight of
100Kg and display the answer in dollars. 
******************************************/

/* Libraries */
var async = require('async');
var request = require('request-json');
var client = request.createClient('http://shopicruit.myshopify.com');

var computerAndKeyboardProducts = [];
var productVariantAndPrice = [];
var variantWeight = [];
var selectedItems = [];

/*
	Use request library to make async call to fetch all products from URL:
	http://shopicruit.myshopify.com/products.json
	Filter all products that are of type Computer and Keyboard.
*/
function fetchProducts(callback) {
    client.get('products.json', function(err, res, body) {
        if (err) throw err();

        body.products.forEach(function(data) {
        if (data.product_type === "Computer" ||
            data.product_type === "Keyboard")
                computerAndKeyboardProducts.push(data)
        });

        callback(null);
    });
}

/*
	Iterate through all items and convert grams to Kg and store specific
	variant data in local array productVariantAndPrice.
*/
function extractAndConvertPriceToKg(callback) {
    computerAndKeyboardProducts.forEach(function(data) {
        data.variants.forEach(function(variant){
            variantWeight.push(
                (variant.grams/1000) //convert grams to Kg
            );
            productVariantAndPrice.push({
                title: data.title,
                variant: variant.title,
                price: variant.price,
                weight: (variant.grams/1000)
            });
        })
    });

    callback(null);
}

/*
	Sort all products by weight in Kg from low to high.
*/
function sortProductByWeight(callback) {
    variantWeight.sort(function(a, b){return a-b});

    callback(null);
}

/*
	Add select item variants until 100Kg is achieved or less.
*/
function selectItems(callback) {
    var weight = 0;
    var weightIndex = 0;

    while (weight <= 100) {
        if (weightIndex == variantWeight.length)
            weightIndex = 0;

        if ((variantWeight[weightIndex] + weight) <= 100) {
            selectedItems.push(variantWeight[weightIndex]);
            weight += variantWeight[weightIndex];
            weightIndex++;
        }
        else if ((variantWeight[0] + weight) <= 100) {
            weightIndex = 0;
        }
        else {
            break;
        }
    }

    callback(null);
}

/*
	Total weight of all selected items.
*/
function calculateAndDisplayTotalWeight(callback) {
    var totalWeight = 0;

    for (var i in selectedItems)
        totalWeight += selectedItems[i];
    console.log('Total weight:', totalWeight);

    callback(null);
}

/*
	Total price of all selected items.
*/
function calculateTotalPrice(callback) {
  var totalPrice = 0;
    for (var i in selectedItems) {
      var result = productVariantAndPrice.filter(function(obj) {
          return obj.weight === selectedItems[i];
      });
      if (result[0]) {
        totalPrice += parseFloat(result[0].price);
      }

      console.log(selectedItems[i]);
      console.log(JSON.stringify(result[0]));
    }

    console.log('The total price:', totalPrice);

    callback(null);
}

/*
	Use async waterfall to ensure functions are called in order because
	fetchProducts() is an async call when retrieving the list of products.
*/
async.waterfall([
    fetchProducts,
    extractAndConvertPriceToKg,
    sortProductByWeight,
    selectItems,
    calculateAndDisplayTotalWeight,
    calculateTotalPrice,
    function(callback) {
        console.log("finished processing");
        callback(null);
    }
]); 
