import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutOutUserAction } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { getCartItems } from "@/store/shop/cart-slice";


function MenuItems(){
    return (
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row ">
          {
            shoppingViewHeaderMenuItems.map(MenuItems => <Link className="text-sm font-medium" key={MenuItems.id} to={MenuItems.Path} >{MenuItems.label}</Link> )
          }
        </nav>
    )
}

function HeaderRightContent(){
    const {user } =useSelector((state)=>state.auth);
    
    const { cartItems, isLoading } = useSelector((state) => state.cart);

    const [openCartSheet, setOpenCartSheet]= useState(false)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    function handleLogout(){
        dispatch(logoutOutUserAction())
    }

    useEffect(() => {
      if (user?.id) {
        console.log("Dispatching getCartItems with userId:", user.id);
        dispatch(getCartItems(user.id));
      }
    }, [dispatch, user?.id]);
    

    const cartItemsToDisplay = cartItems?.items || [];
console.log("cartItemsToDispaly", cartItemsToDisplay);

    console.log("cartItems..." , cartItems)
    return <div className="flex lg:items-center lg:flex-row flex-col gap-4 ">
    <Sheet open={openCartSheet} onOpenChange={()=> setOpenCartSheet(false)}>
    <Button onClick={()=>setOpenCartSheet(true)}  variant="outline" size="icon">
    <ShoppingCart className="w-6 h-6" />
    <span className="sr-only">User Cart</span>
    </Button>
    <UserCartWrapper isLoading={isLoading}     cartItems={
      cartItems && cartItems.items && cartItems.items.length > 0
        ? cartItems.items
        : []
    } />
    </Sheet>

    <DropdownMenu>
       <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
       </DropdownMenuTrigger>
       <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>
            Logged In as {user?.UserName}
          </DropdownMenuLabel>
         <DropdownMenuSeparator />
         <DropdownMenuItem onClick={()=>navigate('/shop/account')}>
         <UserCog className=" mr-3 w-4 h-4" />
         Account
         </DropdownMenuItem>
         <DropdownMenuSeparator />
         <DropdownMenuItem onClick={handleLogout}>
           <LogOut className="mr-2 h-4 w-4" />
           Logout
         </DropdownMenuItem>
       </DropdownMenuContent>
    </DropdownMenu>
    </div>
}

function ShoppingHeader() {

   
    return ( 
        <header className="sticky top-0 z-40 w-full border-b bg-background ">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/shop/home" className="flex items-center gap-2">
            <HousePlug className="h-6 w-6"/>
            <span className="font-bold ">Ecommerce</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
               <Button variant="outline" size="icon" className="lg:hidden">
               <Menu  className="h-6 w-6" />
                 <span className="sr-only">Toggle header menu</span>
               </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <MenuItems />
              <HeaderRightContent />
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block ">
          <MenuItems />
          </div>
       <div className="hidden lg:block">
            <HeaderRightContent />
            </div> 
        </div>
        </header>
     );
}

export default ShoppingHeader;