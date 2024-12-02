import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile, 
  setImageFile,
  uploadImageUrl,
  setUploadImageUrl,
  setIImageLoadingState, 
  imageLoadingState,
  isEditMode
}) {
    const inputRef = useRef(null);

    // Handle file selection
    const handleImageFileChange = (event) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) setImageFile(selectedFile);
    };

    // Handle drag-over event
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // Handle drop event
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile);
    };

    // Remove image
    const handleRemoveImage = () => {
        setImageFile(null);
        setUploadImageUrl(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    // Upload image to Cloudinary
    const uploadImageToCloudinary = async () => {
        setIImageLoadingState(true);
        const data = new FormData();
        data.append("my_file", imageFile);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/admin/products/upload-image",
                data
            );
            if (response?.data?.success) {
                setUploadImageUrl(response.data.result.url);
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIImageLoadingState(false);
        }
    };

    // Trigger upload when imageFile changes
    useEffect(() => {
        if (imageFile) uploadImageToCloudinary();
    }, [imageFile]);

    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={` ${isEditMode ? 'opacity-60' : ""} border-2 border-dashed rounded-lg p-4`}
            >
                <Input 
                    id="image-upload" 
                    type="file"  
                    className="hidden"
                    ref={inputRef} 
                    onChange={handleImageFileChange} 
                    disabled={isEditMode}
                />

                {!imageFile ? (
                    <Label
                        htmlFor="image-upload"
                        className={`${isEditMode ? 'cursor-not-allowed' : "" }  flex flex-col items-center justify-center h-32 cursor-pointer`}
                        aria-label="Click or drag to upload image"
                    >
                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span>Drag & drop or click to upload image</span>
                    </Label>
                ) : imageLoadingState ? (
                    <Skeleton className="h-10 bg-gray-100" />
                ) : (
                    <div className="flex items-center justify-between">
                        <div>
                            <FileIcon className="w-8 h-8 text-primary mr-2" />
                        </div>
                        <p className="text-sm font-medium">{imageFile.name}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={handleRemoveImage}
                        >
                            <XIcon className="w-4 h-4" />
                            <span className="sr-only">Remove File</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductImageUpload;
