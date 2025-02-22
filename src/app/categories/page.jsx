import { CategoriesTable } from '@/components/categories-table'

export default function AdminCategoriesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      <CategoriesTable />
    </div>
  )
}
