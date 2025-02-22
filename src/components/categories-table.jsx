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
import { useGetCategoriesQuery } from "@/features/categories/categoriesApi"
import Link from "next/link"

// const initialCategories = [
//   {
//     id: 5,
//     category_name: "Eats",
//     products: [
//       {
//         id: 6,
//         product_name: "Nissan gtr",
//         description:
//           "This product is very usefull. Buy and change your life. I promise u will be our client after buying it. Trust me do not think that much. Just buy and see the results. That's not alcohol or social media. This product change your life to better. Buy it!!!",
//         price: "15.99",
//         pictures: ["/static/products/1740211534111-ryei1.jpg", "/static/products/1740211534215-zcv7z.jpg"],
//       },
//     ],
//   },
//   {
//     id: 4,
//     category_name: "Electronics",
//     products: [
//       {
//         id: 5,
//         product_name: "Supra mk4 turbo!",
//         description:
//           "This product is very usefull. Buy and change your life. I promise u will be our client after buying it. Trust me do not think that much. Just buy and see the results. That's not alcohol or social media. This product change your life to better. Buy it!!!",
//         price: "14.99",
//         pictures: ["/static/products/1740211562332-4mril.jpg", "/static/products/1740211562453-niq8z.jpg"],
//       },
//     ],
//   },
//   {
//     id: 6,
//     category_name: "Dishes",
//     products: [
//       {
//         id: 7,
//         product_name: "Empire",
//         description:
//           "This product is very usefull. Buy and change your life. I promise u will be our client after buying it. Trust me do not think that much. Just buy and see the results. That's not alcohol or social media. This product change your life to better. Buy it!!!",
//         price: "12345678.99",
//         pictures: [
//           "/static/products/1740211639887-mfo69.jpg",
//           "/static/products/1740211639887-k5swx.jpg",
//           "/static/products/1740211639887-5t1vm.jpg",
//         ],
//       },
//       {
//         id: 8,
//         product_name: "Aura",
//         description:
//           "This product is very usefull. Buy and change your life. I promise u will be our client after buying it. Trust me do not think that much. Just buy and see the results. That's not alcohol or social media. This product change your life to better. Buy it!!!",
//         price: "999.99",
//         pictures: [],
//       },
//     ],
//   },
//   {
//     id: 3,
//     category_name: "Clothes",
//     products: [
//       {
//         id: 4,
//         product_name: "Challanger",
//         description:
//           "This product is very usefull. Buy and change your life. I promise u will be our client after buying it. Trust me do not think that much. Just buy and see the results. That's not alcohol or social media. This product change your life to better. Buy it!!!",
//         price: "13.99",
//         pictures: ["/static/products/1740211935555-0l0cm.jpg", "/static/products/1740211935557-00wcy.jpg"],
//       },
//     ],
//   },
//   {
//     id: 2,
//     category_name: "Gadgets",
//     products: [
//       {
//         id: 3,
//         product_name: "Computer",
//         description:
//           "This product is very usefull. Buy and change your life. I promise u will be our client after buying it. Trust me do not think that much. Just buy and see the results. That's not alcohol or social media. This product change your life to better. Buy it!!!",
//         price: "12.99",
//         pictures: ["/static/products/1740211996045-cawa9.jpg", "/static/products/1740211996060-5o4e2.png"],
//       },
//     ],
//   },
//   { id: 1, category_name: "Groceries", products: [] },
// ]

export function CategoriesTable() {
    const { data: initialCategories, error, isLoading } = useGetCategoriesQuery();
    const [categories, setCategories] = useState([])
    useEffect(() => {
        if (initialCategories) {
            setCategories(initialCategories);
        }
    }, [initialCategories]);

    const [searchTerm, setSearchTerm] = useState("")
    const [newCategoryName, setNewCategoryName] = useState("")
    const [editCategoryId, setEditCategoryId] = useState(null)
    const [editCategoryName, setEditCategoryName] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)

    const filteredCategories = categories.filter((category) =>
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newCategory = {
                id: Math.max(...categories.map((c) => c.id)) + 1,
                category_name: newCategoryName.trim(),
                products: [],
            }
            setCategories([...categories, newCategory])
            setNewCategoryName("")
        }
    }

    const handleEditCategory = (id) => {
        const category = categories.find((c) => c.id === id)
        if (category) {
            setEditCategoryId(id)
            setEditCategoryName(category.category_name)
        }
    }

    const handleUpdateCategory = () => {
        if (editCategoryId && editCategoryName.trim()) {
            setCategories(
                categories.map((c) => (c.id === editCategoryId ? { ...c, category_name: editCategoryName.trim() } : c)),
            )
            setEditCategoryId(null)
            setEditCategoryName("")
        }
    }

    const openDeleteDialog = (id) => {
        setCategoryToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteCategory = () => {
        if (categoryToDelete !== null) {
            setCategories(categories.filter((c) => c.id !== categoryToDelete))
            setDeleteDialogOpen(false)
            setCategoryToDelete(null)
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
                <Dialog>
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
                                    <Button variant="outline" size="icon" onClick={() => handleEditCategory(category.id)}>
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

