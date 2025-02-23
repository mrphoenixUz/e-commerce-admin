"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
    useGetCategoriesQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    categoriesApi,
} from "@/features/categories/categoriesApi"
import Link from "next/link"
import { useDispatch } from "react-redux"

export function CategoriesTable() {
    const { data: categories, error, isLoading } = useGetCategoriesQuery();
    const [addCategory] = useAddCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [searchTerm, setSearchTerm] = useState("")
    const [newCategoryName, setNewCategoryName] = useState("")
    const [editCategoryId, setEditCategoryId] = useState(null)
    const [editCategoryName, setEditCategoryName] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const dispatch = useDispatch()
    const filteredCategories = categories?.filter((category) =>
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    const handleAddCategory = async () => {
        if (newCategoryName.trim()) {
            await addCategory({ category_name: newCategoryName.trim() })
            setNewCategoryName("")
            setIsAddDialogOpen(false);
            dispatch(categoriesApi.util.resetApiState())
        }
    }

    const handleEditCategory = (id, name) => {
        setEditCategoryId(id)
        setEditCategoryName(name)
    }

    const handleUpdateCategory = async () => {
        if (editCategoryId && editCategoryName.trim()) {
            await updateCategory({ categoryId: editCategoryId, category_name: editCategoryName.trim() })
            setEditCategoryId(null)
            setEditCategoryName("")
            dispatch(categoriesApi.util.resetApiState())
        }
    }

    const openDeleteDialog = (id) => {
        setCategoryToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteCategory = async () => {
        if (categoryToDelete !== null) {
            await deleteCategory(categoryToDelete)
            setDeleteDialogOpen(false)
            setCategoryToDelete(null)
            dispatch(categoriesApi.util.resetApiState())
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <Input
                            placeholder="Category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <Button onClick={handleAddCategory}>Add Category</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Products Count</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell>{category.id}</TableCell>
                            <TableCell>
                                {editCategoryId === category.id ? (
                                    <Input value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} />
                                ) : (
                                    category.category_name
                                )}
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">{category.products.length}</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-sm">
                                        <DialogHeader>
                                            <DialogTitle>Products in {category.category_name}</DialogTitle>
                                        </DialogHeader>
                                        {category.products.length > 0 ? (
                                            <ul>
                                                {category.products.map((product) => (
                                                    <li key={product.id} className="flex gap-1 justify-between">
                                                        {product.product_name}
                                                        <Link href={`/product/${product.id}`} className="text-blue-700 hover:underline">
                                                            Product ID: {product.id}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">No products available.</p>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell>
                                {editCategoryId === category.id ? (
                                    <Button onClick={handleUpdateCategory}>Update</Button>
                                ) : (
                                    <Button variant="outline" size="icon" onClick={() => handleEditCategory(category.id, category.category_name)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => openDeleteDialog(category.id)}
                                    className="ml-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this category? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteCategory}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
