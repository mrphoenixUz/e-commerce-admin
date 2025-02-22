import { UsersTable } from "@/components/users-table";

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UsersTable />
    </div>
  )
}

