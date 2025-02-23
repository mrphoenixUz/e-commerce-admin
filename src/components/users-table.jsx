"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { useGetUsersQuery, useRemoveUserMutation } from "@/features/user/userApi";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

export function UsersTable() {
    const { data: allusers, error, isLoading } = useGetUsersQuery();
    const [removeUser, { isLoading: isDeleting }] = useRemoveUserMutation();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (allusers) {
            setUsers(allusers.filter((user) => user.role === "user"));
        }
    }, [allusers]);

    const filteredUsers = users.filter(
        (user) =>
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleDeleteUser = async () => {
        if (selectedUser) {
            await removeUser(selectedUser.id);
            setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div>
            <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm mb-4"
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Profile</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={`http://localhost:3003${user.profile_picture}`} alt={user.first_name} />
                                            <AvatarFallback>{user.first_name[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md p-6 flex flex-col items-center">
                                        <DialogTitle>{user.first_name} {user.last_name}</DialogTitle>
                                        <img src={`http://localhost:3003${user.profile_picture}`} alt={user.first_name} className="w-full h-auto rounded-lg shadow-lg" />
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.first_name} {user.last_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-sm p-6">
                                        <DialogTitle>Are you sure?</DialogTitle>
                                        <DialogDescription>
                                            Do you really want to delete <b>{selectedUser?.first_name} {selectedUser?.last_name}</b>?
                                            This action cannot be undone.
                                        </DialogDescription>
                                        <DialogFooter className="flex justify-end gap-2 mt-4">
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button
                                                variant="destructive"
                                                onClick={handleDeleteUser}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? "Deleting..." : "Delete"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
