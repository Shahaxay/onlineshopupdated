const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize=require('./util/database');
const Product=require('./models/product');
const User=require('./models/user');
const Cart=require('./models/cart');
const CartItem=require('./models/cartItem');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//adding user for each request through middleware through which request always funneled through
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        //inserting sequelize object so we can perform all function of sequelize method later
        req.user=user;
        next();
    })
    .catch(err=>console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//one to many association
Product.belongsTo(User,{constraints:true,onDelete:'cascade'});
User.hasMany(Product);  //optional

//one to one association
User.hasOne(Cart);
Cart.belongsTo(User); //optional

//many to many association
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem}); //optional

// sequelize.sync({force:true}) //it override everything in the models like removing all the recored if it does not match with the constraints
sequelize.sync()
.then(result=>{
    //console.log(result);
    User.findByPk(1)
    .then(user=>{
        if(!user){
            return User.create({name:"Akshay",email:"shahaxay34@gmail.com"});
        }
        // return Promise.resolve(user)  //return promise
        //if we return any object from then then it is automatically wrapped into promise
        return user ;
    })
    .then(user=>{
        //console.log(user);
        Cart.findByPk(1)
        .then(cart=>{
            if(!cart){
                return user.createCart();
            }
            return cart;
        })
        .then(cart=>{
            app.listen(3000);
        })
        .catch(err=>console.log(err));  
    })
    .catch(err=>console.log(err));
})
.catch(err=>console.log(err));

