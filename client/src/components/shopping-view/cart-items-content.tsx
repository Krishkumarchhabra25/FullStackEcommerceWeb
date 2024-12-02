import React from "react";
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {

  const { toast } = useToast()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleCartItemDelete = (cartItem) => {
    dispatch(deleteCartItems({ userId: user?.id, productId: cartItem?.productId }))
      .then((action) => {
        if (action.payload?.success) {
          toast({ title: "Cart item deleted successfully" });
        } else {
          toast({ title: "Failed to delete cart item", status: "error" });
        }
      })
      .catch(() => {
        toast({ title: "An error occurred", status: "error" });
      });
  };
  return (
    <div className="flex items-center space-x-4">
    <img
      src={cartItem?.image}
      alt={cartItem?.title}
      className="w-20 h-20 rounded object-cover"
    />
    <div className="flex-1">
      <h3 className="font-extrabold">{cartItem?.title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <Button
          variant="outline"
          className="h-8 w-8 rounded-full"
          size="icon"
          disabled={cartItem?.quantity === 1}
        
        >
          <Minus className="w-4 h-4" />
          <span className="sr-only">Decrease</span>
        </Button>
        <span className="font-semibold">{cartItem?.quantity}</span>
        <Button
          variant="outline"
          className="h-8 w-8 rounded-full"
          size="icon"
        
        >
          <Plus className="w-4 h-4" />
          <span className="sr-only">Decrease</span>
        </Button>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <p className="font-semibold">
        $
        {(
          (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
          cartItem?.quantity
        ).toFixed(2)}
      </p>
      <Trash
        onClick={()=> handleCartItemDelete(cartItem)}
        className="cursor-pointer mt-1"
        size={20}
      />
    </div>
  </div>
  );
}

export default UserCartItemsContent;