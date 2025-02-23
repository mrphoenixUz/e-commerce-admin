"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useUploadProductImagesMutation, useSearchProductsQuery } from "@/features/products/productsApi";

export default function ProductsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const { data: products = [], refetch } = searchQuery ? useSearchProductsQuery(searchQuery) : useGetProductsQuery();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [uploadProductImages] = useUploadProductImagesMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [formData, setFormData] = useState({
        product_name: "",
        description: "",
        price: "",
        category_id: "",
        pictures: [],
    });

    const handleProductClick = (productId) => {
        router.push(`/product/${productId}`);
    };

    const openModal = (product = null) => {
        setEditProduct(product);
        setFormData(product || { product_name: "", description: "", price: "", category_id: "", pictures: [] });
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, pictures: Array.from(e.target.files) });
    };

    const handleSubmit = async () => {
        let uploadedImages = [];
        if (formData.pictures.length > 0) {
            const formDataToSend = new FormData();
            formData.pictures.forEach((file) => {
                formDataToSend.append("files[]", file);
            });
            const response = await uploadProductImages({ id: editProduct?.id || "new", files: formDataToSend });
            uploadedImages = response.data;
        }
        
        const updatedData = { ...formData, pictures: uploadedImages };
        
        if (editProduct) {
            await updateProduct({ id: editProduct.id, data: updatedData });
        } else {
            const newProductResponse = await createProduct(formData).unwrap();
            if (formData.pictures.length > 0) {
                const formDataToSend = new FormData();
                formData.pictures.forEach((file) => {
                    formDataToSend.append("files", file);
                });
                await uploadProductImages({ id: newProductResponse.id, files: formDataToSend });
            }
        }
        refetch();
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Products</h1>
                <Input className="max-w-xs" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Button onClick={() => openModal()}>Add New Product</Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} className="cursor-pointer">
                                <TableCell className="font-medium">{product.id}</TableCell>
                                <TableCell>{product.product_name}</TableCell>
                                <TableCell className="hidden md:table-cell">{product.description.slice(0, 50)}...</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell className="hidden md:table-cell">{product.category?.category_name}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleProductClick(product.id)}>
                                        View
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => openModal(product)}>
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label>Name</Label>
                        <Input name="product_name" value={formData.product_name} onChange={handleChange} />
                        <Label>Description</Label>
                        <Input name="description" value={formData.description} onChange={handleChange} />
                        <Label>Price</Label>
                        <Input name="price" type="number" value={formData.price} onChange={handleChange} />
                        <Label>Category ID</Label>
                        <Input name="category_id" type="number" value={formData.category_id} onChange={handleChange} />
                        <Label>Pictures</Label>
                        <Input type="file" multiple onChange={handleFileChange} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>{editProduct ? "Update" : "Create"}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
