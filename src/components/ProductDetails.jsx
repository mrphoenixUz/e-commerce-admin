"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDeleteProductMutation, useGetProductQuery } from "@/features/products/productsApi"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useDispatch } from "react-redux"
import { categoriesApi } from "@/features/categories/categoriesApi"

export default function ProductDetailClient({ productId }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const router = useRouter()
    const { data: product, isLoading, error } = useGetProductQuery(productId)
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
    const dispatch = useDispatch()
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Error loading product: {error.message}
            </div>
        )
    }

    if (!product) {
        return <div className="flex justify-center items-center min-h-screen">Product not found</div>
    }

    const handleDelete = async () => {
        try {
            await deleteProduct(productId).unwrap();
            setDeleteDialogOpen(false);
            dispatch(categoriesApi.util.resetApiState())
            router.back();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="relative h-[300px] sm:h-[400px] w-full border rounded-lg overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-xl scale-90 opacity-50"
                            style={{
                                backgroundImage: `url(${product.pictures && product.pictures[selectedImageIndex]
                                    ? `http://localhost:3003${product.pictures[selectedImageIndex]}`
                                    : "/noo.jpeg"
                                    })`,
                            }}
                        />

                        <div className="relative h-full w-full flex items-center justify-center bg-transparent">
                            <img
                                src={
                                    product.pictures && product.pictures[selectedImageIndex]
                                        ? `http://localhost:3003${product.pictures[selectedImageIndex]}`
                                        : "/noo.jpeg"
                                }
                                alt={product.product_name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {product.pictures.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImageIndex(idx)}
                                className={`relative mt-2 ml-1 flex items-center justify-center w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${selectedImageIndex === idx ? "ring-2 ring-primary" : "ring-1 ring-gray-200 hover:ring-gray-300"
                                    }`}
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-50"
                                    style={{
                                        backgroundImage: `url(${img ? `http://localhost:3003${img}` : "/noo.jpeg"})`,
                                    }}
                                />

                                <div className="relative w-full h-full flex items-center justify-center bg-transparent">
                                    <img
                                        src={img ? `http://localhost:3003${img}` : "/noo.jpeg"}
                                        alt={`${product.product_name} view ${idx + 1}`}
                                        className="object-contain max-w-full max-h-full"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 space-y-6">
                    <h1 className="text-3xl font-bold">{product.product_name}</h1>
                    <Separator />
                    <div className="text-3xl font-bold">${Number(product.price).toFixed(2)}</div>
                    <p className="text-gray-600">{product.description || "No description available."}</p>
                    <Separator />
                    <div className="flex space-x-4">
                        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                            Delete product
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the product and remove the data from our
                            servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

