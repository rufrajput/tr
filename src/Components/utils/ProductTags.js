import { Parse } from 'parse';

export const ProductTags = (data) =>{
  let isNew;
  let isSale;
  let isFeatured;
    if(data.get('isNew') === true){
       
            isNew = <div className="icon-new-label new-right">New</div>
        
    }else{
         isNew = null
    }

  if(data.get('onSale') === true){
     
    isSale = <div className="icon-sale-label sale-right">Sale</div>
      
  }else{
    isSale = null
  }

  if(data.get('isFeaturedOffer') === true){
     
    isFeatured = <div className="icon-sale-label sale-right">Sale</div>
      
  }else{
    isFeatured = null
  }


return isSale , isNew , isFeatured;



}