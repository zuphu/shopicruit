var async = require('async');
var request = require('request-json');
var _ = require('lodash');
var client = request.createClient('http://shopicruit.myshopify.com');
var computerAndKeyboardProducts = [];
var variantWeight = [];

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

function sortProducts(callback) {
    console.log("sorting products");
    // console.log(computerAndKeyboardProducts.length);
    computerAndKeyboardProducts.forEach(function(data) {
        // console.log(data.title, "=============");
        data.variants.forEach(function(variants){
            // console.log(variants);
            variantWeight.push(//title: data.title, 
                // price: variants.price, 
                (variants.grams/1000) //convert grams to kg
            );
        })
    });
    callback(null);
}

function findProductByWeight(grams) {
    // computerAndKeyboardProducts.forEach(function(data)) {
    //     if (data.)
    // }
}

async.waterfall([
    fetchProducts,
    sortProducts,
    function(callback) {
        var total = 0;
        for (var x in variantWeight)
            total += variantWeight[x];
            
        console.log(total);
        callback(null);
    }
]);


