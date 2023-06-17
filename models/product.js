const fs = require('fs');
const path = require('path');

const Cart=require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id,title, imageUrl, description, price) {
    this.id=id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      //console.log("received in getProductsFromFile",this.id);
      if(this.id){
        console.log("editing product");
        //edit product
        const productIndex=products.findIndex(p=>p.id==this.id);
        products[productIndex]=this;
      }else{
        //create new product
        console.log("creating new product");
        this.id=Math.random().toString();
        products.push(this);
      }
      console.log(this.id);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static fetchProduct(prodId,cb){
    //console.log(prodId);
    getProductsFromFile(products=>{
      let product=products.find(p=>p.id===prodId);
      console.log("inside");
      console.log(product);
      cb(product);
    })
  }

  static deleteproductbyID(prodId){
    getProductsFromFile(products=>{
      let product=products.find(p=>p.id===prodId);
      let modifiedProducts=products.filter(p=>p.id!==prodId);
      fs.writeFile(p,JSON.stringify(modifiedProducts),err=>{
        if(!err){
          Cart.deleteProduct(prodId,product.price)
        }
      })
    })
  }
};
