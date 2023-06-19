const Product = require('../models/product');

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
  req.user.createProduct({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl
  })
  .then(result=>{
    //console.log(result);
    console.log("element created and inserted into db")
    res.redirect('/admin/products');
  }).catch(err=>console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode=req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId=req.params.productId;
  // Product.findByPk(prodId)
  req.user.getProducts(prodId)
  .then(products=>{
    const product=products[0];
    if(!product){
      console.log("no product found with that id");
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err=>console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
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
  Product.findByPk(prodId)
  .then(product=>{
    product.title=updatedTitle;
    product.imageUrl=updatedImageUrl;
    product.price=updatedPrice;
    product.description=updatedDescription;
    return product.save();
  })
  .then(result=>{
    console.log("UPDATED PRODUCT");
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
}

exports.postDeleteProduct=(req,res,next)=>{
  const prodId=req.body.productId;
  //way:1 (way used to delete multiple element filtered by where)

  // Product.destroy({where:{id:prodId}})
  // .then(result=>{
  //   res.redirect('/admin/products');
  // })
  // .catch(err=>console.log(err));

  //way:2 (used to delete single)

  Product.findByPk(prodId)
  .then(product=>{
    return product.destroy();
  })
  .then(result=>{
    console.log("DELETED ELEMENT");
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
}
