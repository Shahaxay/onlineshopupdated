const Product = require('../models/product');

// const { where } = require('sequelize');
//const Procuct = require('../../../00-starting-setup/models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
    })
    .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      //console.log(product[0].dataValues);
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    })

};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      // console.log(cart);
      return cart.getProducts()
    })
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        totalPrice: "not calculated yet"
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({where:{id:prodId}});
    })
    .then(products => {
      if (products.length > 0) {
        console.log("existing product");
        const product = products[0];
        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        //return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        return product;
      } else {
        //create new products
        console.log("new product");
        newQuantity = 1;
        return Product.findByPk(prodId);
      }

    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(result => {
      console.log("new item added");
      res.redirect('/cart');
    })
    .catch(err => console.log(err));

}

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where:{id:prodId}})
  })
  .then(products=>{
    console.log(products[0]);
    return products[0].cartItem.destroy();
  })
  .then(result=>{
    res.redirect('/cart');
  })
  .catch(err=>console(err));
}

exports.getOrders = (req, res, next) => {

  req.user.getOrders({include:['products']})
  .then(orders=>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders:orders
    });
  })
  .catch(err=>console.log(err));
};

exports.postOrder=(req,res,next)=>{
  let fetchedproducts;
  let fetchedCart;
  req.user.getCart()
  .then(cart=>{
    fetchedCart=cart;
    return cart.getProducts();
  })
  .then(products=>{
    fetchedproducts=products;
    return req.user.createOrder();
  })
  .then(order=>{
    return order.addProducts(fetchedproducts.map(product=>{
      product.orderItem={quantity:product.cartItem.quantity};
      return product;
    }))
  })
  .then(result=>{
    // console.log(result);

    //resetting the cart
    return fetchedCart.setProducts(null);
  })
  .then(result=>{
    // console.log(result);
    res.redirect('/orders');
  })
  .catch(err=>console.log(err));
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
