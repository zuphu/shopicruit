var async = require('async');
var request = require('request-json');
var _ = require('lodash');
var client = request.createClient('http://shopicruit.myshopify.com');
var computerAndKeyboardProducts = [];
var productVariantAndPrice = [];
var variantWeight = [];
var selectedItems = [];

function fetchProducts(callback) {
    console.log("fetching products");
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

function extractAndConvertPrice(callback) {
    console.log("sorting products");
    // console.log(computerAndKeyboardProducts.length);
    computerAndKeyboardProducts.forEach(function(data) {
        // console.log(data.title, "=============");
        data.variants.forEach(function(variant){
            // console.log(variant);
            variantWeight.push(//title: data.title, 
                // price: variant.price, 
                (variant.grams/1000) //convert grams to kg
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

function sortProductByWeight(callback) {
    variantWeight.sort(function(a, b){return a-b});
    callback(null);
}

function logEverything(callback) {
    console.log(productVariantAndPrice);
    console.log(variantWeight);

    var x = _.filter(productVariantAndPrice, function(data){
        return data.price == 18.76;
    });

    console.log("WTF BBQ");
    console.log(x);
    callback(null);
}

function selectItems(callback) {
    var weight = 0;
    var weightIndex = 0;
    
    
    while (weight <= 100) {
        if (weightIndex == variantWeight.length)
            weightIndex = 0;

        if ((variantWeight[weightIndex] + weight) <= 100) {
            selectedItems.push(variantWeight[weightIndex]);
            weight += variantWeight[weightIndex];
            console.log('adding weight', variantWeight[weightIndex])
            weightIndex++;
        }
        else if ((variantWeight[0] + weight) <= 100) {
            weightIndex = 0;
        }
        else {
            console.log('too much weight with variant', variantWeight[weightIndex])
            break;
        }
    }
    callback(null);
}

function calculateTotalWeight(callback) {
    var totalWeight = 0;
    for (var x in selectedItems)
        totalWeight += selectedItems[x];
    console.log('Total weight:', totalWeight);
    callback(null);
}

async.waterfall([
    fetchProducts,
    extractAndConvertPrice,
    sortProductByWeight,
    selectItems,
    calculateTotalWeight,
    function(callback) {
        console.log("finished processing");
        callback(null);
    }
]);


