 
import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDiolog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  sortOptions } from "@/config";

import { addToCart, getCartItems } from "@/store/shop/cart-slice";
import { fetchFilteredProducts, fetchProductsDetails } from "@/store/shop/product-slice";

import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function createSearchParamsHelper(filtersParams){
   const queryParams = [];
   for(const [key, value] of Object.entries(filtersParams)){
      if(Array.isArray(value) && value.length > 0){
        const paramValue = value.join(',');
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
      }
   }
   return queryParams.join("&")
}


function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList ,isLoading , productDetails} = useSelector((state) => state.shopProducts);
  const {user} = useSelector(state=>state.auth);
  const {cartItems}=useSelector(state => state.cart)
  const [filters , setFilters] =useState({});
  const [sort , setSort] = useState(null)
  const [searchParams , setSearchParams] = useSearchParams()
  const [openDetailsDialog, setOpenDetailsDialog]= useState(false)
  const {toast} = useToast()
  useEffect(() => {
    if(filters !== null && sort !== null)
    dispatch(fetchFilteredProducts({filterParams : filters , sortParams : sort}));
  }, [dispatch, sort , filters]);


  useEffect(()=>{
    setSort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
  },[]);

  useEffect(()=>{
    if(filters && Object.keys(filters).length > 0){
      const createQueryString = createSearchParamsHelper(filters)
      setSearchParams(new URLSearchParams(createQueryString))
    }
  },[filters, setSearchParams])


  console.log("filters...",searchParams, filters );
function handleSort(value){
  setSort(value);
}

 function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId){
     console.log("getproductcurrentid", getCurrentProductId)
     dispatch(fetchProductsDetails(getCurrentProductId))
  }


function handleAddToCart(getCurrentProductId) {
  dispatch(
    addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })
  ).then((data) =>{
    if(data?.payload?.success){
      dispatch(getCartItems(user?.id));
      toast({
        title:'Product is added to cart'
      })
    }
  });
}
  useEffect(()=>{
    if(productDetails !== null) setOpenDetailsDialog(true)
  },[productDetails]);

  console.log("cartItemsarray",cartItems)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilters={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex  items-center justify-between">
          <h2 className="text-lg font-extrabold ">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{productList?.length}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItems) => (
                    <DropdownMenuRadioItem value={sortItems.id} key={sortItems.id}>
                      {sortItems.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {isLoading ? <p>Loading...</p> : productList.length > 0 ? (
          productList.map((productItem) => (
            <ShoppingProductTile  key={productItem._id} handleGetProductDetails={handleGetProductDetails} product={productItem} handleAddToCart={handleAddToCart} />
          ))
        ) : <h1>Products not found</h1>}
        </div>
      </div>
        <ProductDetailsDiolog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  );
}

export default ShoppingListing;