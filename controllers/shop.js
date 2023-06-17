const Product = require('../models/product');
const Cart=require('../models/cart');
//const Procuct = require('../../../00-starting-setup/models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(([data,metaData])=>{
    res.render('shop/product-list', {
      prods: data,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err=>console.log(err));
};

exports.getProduct = (req,res,next)=>{
  const prodId=req.params.productId;
  Product.fetchProduct(prodId)
  .then(([product,metadata])=>{
    // console.log(product[0]);
    res.render('shop/product-detail',{product: product[0], pageTitle: product[0].title, path: '/products'});
  })
  .catch(err=>console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(([data,metadata])=>{
    res.render('shop/index', {
      prods: data,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart=>{
    console.log(cart);
    if(cart){
      Product.fetchAll(products=>{
        const cartProducts=[];
        for(let product of products){
          const prd=cart.products.find(p=>p.id===product.id);
          if(prd){
            cartProducts.push({"title": product.title, "quantity": prd.quantity, "id":prd.id})
          }
        }
        console.log("cart:",cartProducts);
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartProducts,
          totalPrice:cart.totalPrice
        });
      })
    }else{
      res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: []
        });
    }
  })
  
};

exports.postCart=(req,res,next)=>{
  const prodId=req.body.productId;
  // console.log(prodId,prodId.length);
  Product.fetchProduct(prodId,product=>{
    // console.log(product);
    Cart.addProduct(prodId, product.price);
  })
  res.redirect('/cart');

}

exports.postDeleteCartItem=(req,res,next)=>{
  const prodId=req.body.productId;
  console.log(prodId);
  Product.fetchProduct(prodId,product=>{
    Cart.deleteProduct(prodId,product.price);
    res.redirect('/cart');
  })

}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
