let datbase = require("./datbase.js");
module.exports = function main() {
    console.log("Debug Info");
    return 'Hello World!';
};

function printInventory(inputs)
{
    let i;
    let result;
    let items;
    let j;
    let promotionItems;
    let totalSum = 0;
    let totlaSave = 0;

    console.log("***<没钱赚商店>购物清单***");

    //获得这次购买的所有商品条码和数量
    result = count_same_elements(inputs);

    //获得商店中所有商品的信息
    items = datbase.loadAllItems();

    //获得所有的打折信息
    promotionItems = datbase.loadPromotions();

    for(i=0;i<result.length;i++)
    {
        let save = saveMoney(result[i].barcode,promotionItems,result[i].count);

        for(j=0;j<items.length;j++)
        {
            if(items[j].barcode===result[i].barcode)
            {
                totlaSave += save*items[j].price;
                let sum = items[j].price*result[i].count - save*items[j].price;
                totalSum+=sum;
                console.log("名称："+items[j].name+"，数量："+result[i].count+items[j].unit+"，单价："+items[j].price.toString()+"，小计："+sum+"(元)");
            }
        }
    }

    console.log("----------------------");
    console.log("挥泪赠送商品：");
    for(i=0;i<result.length;i++)
    {
        let save = saveMoney(result[i].barcode,promotionItems,result[i].count);
        if(save!==0)
        {
            for(j=0;j<items.length;j++)
            {
                if(items[j].barcode===result[i].barcode)
                {
                    console.log("名称："+items[j].name+"，数量："+save+items[j].unit);
                }
            }
        }
    }

    console.log("----------------------");
    console.log("总计："+totalSum+"(元)");
    console.log("节省："+totlaSave+"(元)");

}

//统计购物清单里面的物品总数
function count_same_elements(collection) {
    let result=[];
    let subOne;
    let subTwo;
    for(let l = 0;l<collection.length;l++)
    {
        let number = 0;
        let k = collection[l];
        subTwo = k.substring(0,10);
        //console.log("k");
        //console.log(k);
        if(k.length>10)
        {
            subOne = k.substring(11);
            for(let i = 0;i<subOne.length;i++)
            {
                let a = 0;
                while(a!=subOne[i])
                    a++;
                number = number*10+a;
            }
        }
        let tag = -1;
        for(let w = 0;w< result.length;w++)
        {
            let b = result[w];
            if(b.barcode===subTwo)
                tag = w;
        }
        if(tag===-1)
        {
            let tem = {};
            tem.barcode = subTwo;

            if(k.length>10)
                tem.count = number;
            else
                tem.count = 1;
            result.push(tem);
        }
        else
        {
            if(k.length>10)
                result[tag].count+=number;
            else
                result[tag].count+=1;
        }

    }
    return result;
}

function saveMoney(barcode,promotionItems,number)
{
    let i;
    let j;
    for(i=0;i<promotionItems.length;i++)
    {
        let oneTypeOfPro = promotionItems[i].barcodes;
        for(j=0;j<oneTypeOfPro.length;j++) {
            if (oneTypeOfPro[j] === barcode) {
                if (promotionItems[i].type === "BUY_TWO_GET_ONE_FREE")
                {
                    return Math.floor(number / 3);
                }
            }
        }
    }
    return 0;
}

let inputs = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
];

printInventory(inputs);

