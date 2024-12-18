
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({cartItems , isLoading}){
  console.log("wrappercart", cartItems); 
    return (
       <SheetContent className="sm:max-w-md">
         <SheetHeader>
           <SheetTitle>Your Cart</SheetTitle>
         </SheetHeader>
         <div className="mt-8 space-y-4">
         {isLoading ? (
          <div>Loading...</div>
        ) : cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <UserCartItemsContent key={item.id || index} cartItem={item} />
          ))
        ) : (
          <div>Your cart is empty.</div>
        )}
         </div>
         <div className="mt-8 space-y-4">
          <div className="flex justify-between">
          <span className="font-bold">Total </span>
          <span className="font-bold">$1000 </span>
          </div>
         </div>
         <Button className="w-full mt-6 ">Checkout</Button>
       </SheetContent>
    )
}

export default UserCartWrapper;