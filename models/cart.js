const fs=require('fs');
const path=require('path');

const Product=require("./product");

const p=path.join(path.dirname(process.mainModule.filename),'data','cart.json');
module.exports=class cart{
    static addProduct(id,productPrice){
        fs.readFile(p,(err,data)=>{
            let cart={
                products:[],
                totalPrice:0
            };
            if(!err){
                cart=JSON.parse(data);
            }else{
                console.log(err.message);
            }
            const existingProductIndex=cart.products.findIndex(p=>p.id===id);
            const existingProduct=cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct={...existingProduct};
                updatedProduct.quantity=updatedProduct.quantity+1;
                cart.products[existingProductIndex]=updatedProduct;
            }else{ 
                updatedProduct={'id':id,'quantity':1};
                cart.products=[...cart.products,updatedProduct];
            }

            cart.totalPrice=cart.totalPrice + +productPrice;
            fs.writeFile(p,JSON.stringify(cart),err=>console.log(err));
        })
    }

    static deleteProduct(prodId,prod_price){
        fs.readFile(p,(err,data)=>{
            if(err){
                return;
            }
            let obj={...JSON.parse(data)};
            const product=obj.products.find(obj=>obj.id===prodId);
            if(!product){
                return;
            }
            const quantity=product.quantity;
            obj.products=obj.products.filter(eachobj=>eachobj.id!==prodId);
            obj.totalPrice=obj.totalPrice-quantity*prod_price;
            fs.writeFile(p,JSON.stringify(obj),err=>{
                console.log(err);
            });

        })
    }

    static getCart(cb){
        fs.readFile(p,(err,data)=>{
            if(err){
                cb(null);
            }else{
                const cart=JSON.parse(data);
                cb(cart); 
            }
        })
    }
}