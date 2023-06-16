const fs=require('fs');
const path=require('path');
module.exports=class cart{
    static addProduct(id,productPrice){
        const p=path.join(path.dirname(process.mainModule.filename),'data','cart.json');
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
}