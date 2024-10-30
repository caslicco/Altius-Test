const express = require('express');
const bodyParser= require('bodyParser');
const app = express();
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

db = mongoose.connect('mongodb://127.0.0.1:27017/altiusInvoices');

const counterSchema= mongoose.Schema({
    num: {type: Number, default: 0}
});

const itemSchema = new mongoose.Schema({
    invoiceHeader : {
        _id: Schema.Types.ObjectId,
        date: {type: Date, default: Date.now},
        invoiceNumber: {type: Number, required: true},
        custName: {type: String, required: true},
        billAddr: {type: String, required: true},
        shipAddr: {type: String, required: true},
        GSTIN: {type: String},
        TotalAmount: {type: Schema.Types.Decimal128, required: true}
    },
    invoiceItem: {
        _id: Schema.Types.ObjectId,
        itemName: {type: String, required: true},
        qty: {type: Schema.Types.Decimal128, required: true},
        price: {type: Schema.Types.Decimal128, required: true},
        amount: {type: Schema.Types.Decimal128, required: true},
        
    }
});

const billSundrySchema = new mongoose.Schema({
    invoiceHeader : {
        _id: Schema.Types.ObjectId,
        date: {type: Date, default: Date.now},
        invoiceNumber: {type: Number, required: true},
        custName: {type: String, required: true},
        billAddr: {type: String, required: true},
        shipAddr: {type: String, required: true},
        GSTIN: {type: String},
        TotalAmount: {type: Schema.Types.Decimal128, required: true}
    },
    billSundry: {
        _id: Schema.Types.ObjectId,
        billSundryName: {type: String, required: true},
        amount: {type: Schema.Types.Decimal128, required: true},
        
    }
});

const Item = mongoose.model("Item", itemSchema);
const BillSundry = mongoose.model("BillSundry", billSundrySchema);
const Counter = mongoose.model("Counter", counterSchema);

const createItem = async (req, res, next)=>{
    let itm = new Item(req.body);
    if (itm.invoiceItem.amount !=itm.invoiceItem.price * itm.invoiceItem.qty)
    {
        res.json({error: "Invalid Amount"});
    }
    await itm.save();
    console.log("Inserted Invoice of Item");
}

const createBillSundry= async (req, res, next)=>{
    let itm = new BillSundry(req.body);
    await itm.save();
    console.log("Inserted Invoice of Bill Sundry");
}

const get = async (req, res, next)=>{
    let itm = await Item.findOne({invoiceHeader.invoiceNumber: req.params.invoiceNumber});
    if(itm){
        res.json(itm);
        console.log(itm);
    }
    else{
        let sundry = await BillSundry.findOne({invoiceHeader.invoiceNumber: req.params.invoiceNumber});
        res.json(sundry);
        console.log(sundry);
    }
}

const update = async (req, res, next)=>{
    let type = req.query.type;
    if(type === 'item'){
        await Item.findOneAndUpdate({invoiceHeader.invoiceNumber: req.body.invoiceHeader.invoiceNumber}, req.body);
    }
    else if(type==='sundry'){
        await BillSundry.findOneAndUpdate({invoiceHeader.invoiceNumber: req.body.invoiceHeader.invoiceNumber}, req.body);
    }
}

const del = async (req, res, next)=>{
    let type = req.query.type;
    if(type === 'item'){
        await Item.findOneAndRemove({invoiceHeader.invoiceNumber: req.body.invoiceHeader.invoiceNumber});
    }
    else if(type==='sundry'){
        await BillSundry.findOneAndRemove({invoiceHeader.invoiceNumber: req.body.invoiceHeader.invoiceNumber});
    }
}

app.post('/createItem', createItem);
app.post('/createBillSundry', createBillSundry);
app.get('/read/:invoiceNumber', get);
app.put('/update', update);
app.delete('/delete', del);

app.listen(5000, ()=>{console.log('Running on Port 5000...')});