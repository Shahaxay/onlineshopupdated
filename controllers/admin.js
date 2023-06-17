const path=require('path');
const fs=require('fs');

const Product = require('../models/product');
const rootDir=require('../util/path');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null,title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode=req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId=req.params.productId;
  Product.fetchProduct(prodId,product=>{
    if(!product){
      console.log("no product found with that id");
      return res.redirect('/');
    }
    console.log('from getEditProduct',product);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
//editing the product
exports.postEditProduct=(req,res,next)=>{
  const prodId=req.body.productId;
  console.log("from PostEditProduct",prodId);
  //creating new product
  const updatedTitle=req.body.title;
  const updatedImageUrl=req.body.imageUrl;
  const updatedPrice=req.body.price;
  const updatedDescription=req.body.description;
  const updatedProduct=new Product(prodId,updatedTitle,updatedImageUrl,updatedDescription,updatedPrice);
  updatedProduct.save();
  res.redirect('/admin/products');
}

exports.postDeleteProduct=(req,res,next)=>{
  const prodId=req.body.productId;
  console.log("fromPostDeleteProduct",prodId);
  Product.deleteproductbyID(prodId);
  res.redirect('/admin/products');

  //Another way:

  // Product.fetchAll(products=>{
  //   //console.log(products);
  //   //deleting products with given id
  //   for(var i=0;i<products.length;i++){
  //     if(products[i].id===prodId){
  //       products.splice(i,1);
  //       break;
  //     }
  //   }
  //   //overwriting the products array in products.json file
  //   fs.writeFile(path.join(rootDir,'data','products.json'),JSON.stringify(products),err=>{
  //     console.log(err);
  //     if(!err){
  //       res.redirect('admin/products');
  //     }
  //   })

  // })
}
