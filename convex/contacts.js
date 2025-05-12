import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const getAllContacts = query({
  handler: async (ctx) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    if (!currentUser) {
        throw new Error("Current user not found");
      }

    const expensesYouPaid = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_group", (q) =>
        q.eq("paidByUserId", currentUser._id).eq("groupId", undefined)
      )
      .collect();

    const expensesNotPaidByYou = (
      await ctx.db
        .query("expenses")
        .withIndex("by_group", (q) => q.eq("groupId", undefined))
        .collect()
    ).filter(
      (e) =>
        e.paidByUserId !== currentUser._id &&
        e.splits.some((s) => s.userId === currentUser._id)
    ); // Removed the extra closing parenthesis here

    const personalExpenses = [...expensesYouPaid, ...expensesNotPaidByYou];
    const contactIds = new Set();

    personalExpenses.forEach((exp) => {
      // Add the payer if it's not the current user
      if (exp.paidByUserId !== currentUser._id) {
        contactIds.add(exp.paidByUserId);
      }

      // Add all users in splits that aren't the current user
      exp.splits.forEach((split) => {
        if (split.userId !== currentUser._id) {
          contactIds.add(split.userId);
        }
      });
    });

    const contactUsers = await Promise.all(
      [...contactIds].map(async (id) => {
        const user = await ctx.db.get(id);

        return user
          ? {
              _id: user._id,
              name: user.name,
              email: user.email,
              imageUrl: user.imageUrl,
              type: "user", // Add a type marker to distinguish from groups
            }
          : null;
      })
    );

    // Fetch and filter user's groups
        const userGroups = (await ctx.db.query("groups").collect())
        .filter((group) => 
        group.members.some((member) => member.userId === currentUser._id)
        )
        .map((group) => ({
        _id: group._id,
        name: group.name,
        description: group.description,
        memberCount: group.members.length,
        type: "group", // Type marker to distinguish from users
        }));

        // Sort contacts and groups alphabetically by name
        contactUsers.sort((a, b) => a?.name.localeCompare(b?.name));
        userGroups.sort((a, b) => a.name.localeCompare(b.name));

        return{
            users: contactUsers.filter(Boolean),
            groups: userGroups,
        };
  },
});

export const createGroup = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        members: v.array(v.id("users")),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
        if (!args.name.trim()) throw new Error("Group name cannot be empty");
        const uniqueMembers = new Set(args.members);
        uniqueMembers.add(currentUser._id);
        for (const id of uniqueMembers) {
            if (!await ctx.db.get(id)) {
                throw new Error(`User with ID ${id} not found`);
            }
        }
  
        return await ctx.db.insert("groups", {
        name:args.name.trim(),
        description: args.description?.trim() ?? "",
        createdBy: currentUser._id,
        members: [...uniqueMembers].map((id) => ({
            userId: id,
            role: id === currentUser._id ? "admin" : "member",
            joinedAt: Date.now(),
        })),       
        });
    },
});