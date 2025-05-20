"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Plus, User, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import CreateGroupModal from "./_components/create-group-modal";
import { useRouter, useSearchParams } from "next/navigation";

const ContactsPage = () => {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const { data, isLoading } = useConvexQuery(api.contacts.getAllContacts);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const createGroupParam = searchParams.get("createGroup");

    if (createGroupParam === "true") {
      setIsCreateGroupModalOpen(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("createGroup");

      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  // Ensure users and groups are always defined
  const { users = [], groups = [] } = data || {};

  return (
    <div className="container mx-auto py-6">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-5xl gradient-title font-extrabold gradient">
          Contacts
        </h1>
        <Button
          onClick={() => setIsCreateGroupModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Group
        </Button>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* People Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-green-600">
            <User className="mr-2 h-6 w-6" />
            People
          </h2>

          {users.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              No contacts yet. Add an expense with someone to see them here.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <p className="font-bold text-lg">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Groups Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-green-600">
            <Users className="mr-2 h-6 w-6" />
            Groups
          </h2>

          {groups.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              No groups yet. Create a group to see it here.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <p className="font-bold text-lg">{group.name}</p>
                  <p className="text-sm text-gray-500">{group.description}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {group.memberCount}{" "}
                    {group.memberCount === 1 ? "person" : "people"} in this group
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

          <CreateGroupModal 
          isOpen={isCreateGroupModalOpen}
          onClose={() => setIsCreateGroupModalOpen(false)}
          onSuccess={(groupId) => router.push(`/groups/${groupId}`)}
          />

    </div>
  );
};

export default ContactsPage;