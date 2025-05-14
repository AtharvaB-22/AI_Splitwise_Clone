import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from '@/convex/_generated/api';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { UserPlus, X } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { toast } from 'sonner';

const groupSchema = z.object({
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
});

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
    
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [commandOpen, setCommandOpen] = useState(false);

    const { data: currentUser} =useConvexQuery(api.users.getCurrentUser);
    const { data: searchResults, isLoading: isSearching } =useConvexQuery(api.users.searchUsers,
        { query:searchQuery}
     );
     const createGroup=useConvexMutation(api.contacts.createGroup)

     const addMember = (user) => {
    
        if (!selectedMembers.some((member) => member._id === user._id)) {
            setSelectedMembers([...selectedMembers, user]);
            toast.success(`${user.name || user.email} added to the group.`);
        } else {
            toast.error("This user is already added to the group.");
        }
        setCommandOpen(false);
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const removeMember = (userId) => {
        setSelectedMembers(selectedMembers.filter((member) => member._id !== userId));
    };

    const handleClose = () => {
        reset(); // Reset the form fields
        setSelectedMembers([]); // Clear selected members
        onClose(); // Call the onClose function passed as a prop
    };

    const onSubmit = async (data) => {
        try{
            // const memberIds = selectedMembers.map((member) => member._id);

            const validMembers = selectedMembers.filter((member) => member._id);

                if (validMembers.length === 0) {
                toast.error("Please add at least one valid member to the group.");
                return;
                }

            const memberIds = validMembers.map((member) => member._id);

            const groupId = await createGroup.mutate({
                name: data.name,
                description: data.description,
                members: memberIds,
            });

            toast.success("Group created successfully!");
            handleClose(); // Close the modal after successful creation
            if(onSuccess) onSuccess(groupId); // Call the onSuccess function if provided
        } catch (error) {
            toast.error("Failed to create group: "+ error.message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new group you want to create.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" >
                    <div className="space-y-2">
                        <label htmlFor="name">Group Name</label>
                        <input
                            id="name"
                            placeholder="Enter group name"
                            {...register("name")}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description">Group Description</label>
                        <textarea
                            id="description"
                            placeholder="Enter group description (optional)"
                            {...register("description")}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label>Members</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {currentUser && (
                            <Badge variant="outline" className="flex items-center gap-2">
                                <Avatar>
                                <AvatarFallback>
                                    {currentUser.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                                </Avatar>
                                <span>{currentUser.name} (You)</span>
                            </Badge>
                            )}

                            {selectedMembers.map((member) => (
                                <Badge
                                    key={member._id } 
                                    variant="secondary"
                                    className="flex items-center px-3 py-1"
                                >
                                 <Avatar className="h-5 w-5 mr-2">
                                 <AvatarImage src={member.imageUrl} />
                                 <AvatarFallback>
                                        {member.name?.charAt(0) || "?"}
                                 </AvatarFallback>
                                 </Avatar>
                                 <span>{member.name}</span>
                                 <button
                                   type="button"
                                   onClick={() => removeMember(member._id)}
                                   className="ml-2 text-muted-foreground hover:text-foreground"
                                >
                                  <X className="h-3 w-3" />
                                  </button>
                                  </Badge>
                                ))
                            }

                            <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1 text-x5"
                                    >
                                        <UserPlus className="h-3.5 w-3.5" />
                                        Add Members
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" align="start" side="bottom">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search by name or email..."
                                            value={searchQuery}
                                            onValueChange={setSearchQuery}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                {searchQuery.length < 2 ? (
                                                    <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                        Type at least 2 characters to search
                                                    </p>
                                                ) : isSearching ? (
                                                    <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                        Searching...
                                                    </p>
                                                ) : (
                                                    <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                        No users found
                                                    </p>
                                                )}
                                            </CommandEmpty>
                                            <CommandGroup heading="Users">
                                                {searchResults?.map((user) => (
                                                    <CommandItem
                                                        key={user._id } // Ensure a unique key
                                                        value={user.name + user.email}
                                                        onSelect={() => {
                                                            addMember(user); // Add the selected member
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={user.imageUrl} />
                                                                <AvatarFallback>
                                                                    {user.name?.charAt(0) || "?"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">{user.name}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {user.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {selectedMembers.length === 0 && (
                            <p className="text-sm text-amber-500">
                                Add atleast one member to the group.
                            </p>
                        )}
                        </div>

                    <DialogFooter>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            disabled={isSubmitting || selectedMembers.length === 0}
                        >
                            {isSubmitting ? "Creating..." : "Create Group"}
                        </button>
                        <button
                            type="button"
                            variant ="outline"
                            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupModal;
