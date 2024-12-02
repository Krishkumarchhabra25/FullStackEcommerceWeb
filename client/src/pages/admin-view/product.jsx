import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTitle from "@/components/admin-view/Product-tile";

import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";



const initialFormData ={
    image: null, 
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalPrice: '',
}
function AdminProducts() {

    const [openCreateProductDialog , setopenCreateProductDialog] = useState(false)

    const [formData , setFormData] = useState(initialFormData)

    const [imageFile , setImageFile] = useState(null);

    const [uploadImageUrl , setUploadImageUrl] =useState('');

    const [imageLoadingState , setIImageLoadingState] = useState(false);
    
    const [currentEditedId , setCurrentEditedId] = useState(null)
    const {  productList} = useSelector(state => state.adminProducts);


    const dispatch = useDispatch();

    const {toast} = useToast()

    function onSubmit(event){
      event.preventDefault();

      currentEditedId !== null ?
      dispatch(editProduct({
        id: currentEditedId,
        formData
      })).then((data)=> {
        console.log(data , 'edit..');

        if(data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setopenCreateProductDialog(false);
          setCurrentEditedId(null);
          
          toast({
            title: 'Product edit successfully'
          })
        }
      })
 :
      dispatch(addNewProduct({
        ...formData,
        image: uploadImageUrl
      })).then((data)=>{
        console.log(data);
        if(data?.payload?.success){
          dispatch(fetchAllProducts());
          setopenCreateProductDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
        
          toast({
            title: 'Product add successfully'
          })
        }
      })
    }


 /*    function isFormValid() {
      // Check that all required fields in formData have non-empty values and are valid
      return Object.keys(formData).every((key) => {
        const value = formData[key];
        // For fields that are required, check for empty strings or null values
        return value !== null && value !== '';
        
      }) && uploadImageUrl; // Ensure an image URL is provided as well
      
    } */
    

    function handleDelete(getCurrentProductId){
      console.log(getCurrentProductId)
      dispatch(deleteProduct(getCurrentProductId)).then(data=>{
        if(data?.payload?.success){
          dispatch(fetchAllProducts());
          toast({
            title: 'Product deleted successfully'
          })
        }
      })
    }
    useEffect(() => {
      dispatch(fetchAllProducts());
    }, [dispatch]);
  

    console.log(formData , "productList");
    return ( 
        <Fragment>
          <div className="mb-5 flex justify-end">
            <Button onClick={()=> setopenCreateProductDialog(true)}>
            Add New Product
            </Button>
          </div>
          <div className="grid gap-4 md::grid-cols-3 lg:grid-cols-4">
          { 
            productList && productList.length > 0
              ? productList.map(productItem => (
                <AdminProductTitle setFormData={setFormData} setopenCreateProductDialog={setopenCreateProductDialog} setCurrentEditedId={setCurrentEditedId} key={productItem._id} product={productItem} handleDelete={handleDelete} />
              ))
              : <h1>No products found</h1>
          }
          </div>
          <Sheet
          open={openCreateProductDialog}
          onOpenChange={() => {
              setopenCreateProductDialog(false);
              setCurrentEditedId(null);
              setFormData(initialFormData);
          }}
      >
            <SheetContent side="right" className="overflow-auto">
               <SheetHeader>
               <SheetTitle>
               { 
                 currentEditedId !== null ?
                 'Edit Product' : 'Add New Product'
               }
               </SheetTitle>  
               </SheetHeader>
               <ProductImageUpload
                imageFile={imageFile}
             
             uploadImageUrl={uploadImageUrl} 
             setImageFile={setImageFile} 
             setUploadImageUrl={setUploadImageUrl}
             setIImageLoadingState={setIImageLoadingState}
             imageLoadingState={imageLoadingState}
             isEditMode={currentEditedId !== null}
             />
               <div className="py-6">
               <CommonForm 
              
               formData={formData} 
               onSubmit={onSubmit} 
               setFormData={setFormData} 
               buttonText={currentEditedId !== null ? 'Edit' : 'Add'} 
               formControls={addProductFormElements} 
             />
                            </div>
            </SheetContent>
          </Sheet>
        </Fragment>
     );
}

export default AdminProducts;