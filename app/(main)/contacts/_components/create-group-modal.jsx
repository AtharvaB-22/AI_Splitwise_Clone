import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from '@/convex/_generated/api';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { query } from '@/convex/_generated/server';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

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

    const handleClose = () => {
        reset(); // Reset the form fields
        if (onClose) {
            onClose(); // Call the onClose function passed as a prop
        }
    };

    const onSubmit = async (data) => {
        try {
            // Simulate group creation logic
            console.log("Group data submitted:", data);

            if (onSuccess) {
                onSuccess(); // Call the onSuccess function if provided
            }

            handleClose(); // Close the modal after successful submission
        } catch (error) {
            console.error("Error creating group:", error);
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

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

                            <Popover>
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
                                <PopoverContent>
                                 Place content for the popover here.    
                                </PopoverContent> 
                            </Popover>
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Group"}
                        </button>
                        <button
                            type="button"
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