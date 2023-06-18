const Product = require('../models/product');
const Cart=require('../models/cart');
//const Procuct = require('../../../00-starting-setup/models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then((products)=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err=>console.log(err));
};

exports.getProduct = (req,res,next)=>{
  const prodId=req.params.productId;
  Product.findByPk(prodId)
  .then(product=>{
    res.render('shop/product-detail',{product: product, pageTitle: product.title, path: '/products'});
  })
  .catch(err=>console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products=>{
    //console.log(product[0].dataValues);
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>{
    console.log(err);
  })

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
