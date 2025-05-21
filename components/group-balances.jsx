"use client";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

/**
 * Expected `balances` shape (one object per member):
 * {
 *   id:           string;           // user id
 *   name:         string;
 *   imageUrl?:    string;
 *   totalBalance: number;           // + ve ⇒ they are owed, – ve ⇒ they owe
 *   owes:   { to: string;   amount: number }[];  // this member → others
 *   owedBy: { from: string; amount: number }[];  // others → this member
 * }
 */
export function GroupBalances({ balances }) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  /* ───── guards ────────────────────────────────────────────────────────── */
  if (!balances?.length || !currentUser) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No balance information available
      </div>
    );
  }

  /* ───── helpers ───────────────────────────────────────────────────────── */
  const me = balances.find((b) => b.id === currentUser._id);
  if (!me) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        You’re not part of this group
      </div>
    );
  }

  const userMap = Object.fromEntries(balances.map((b) => [b.id, b]));

  const netBalances = {};
balances.forEach((b) => {
  if (b.id === me.id) return;
  // Amount they owe me
  const owedToMe = me.owedBy.find((x) => x.from === b.id)?.amount || 0;
  // Amount I owe them
  const iOwe = me.owes.find((x) => x.to === b.id)?.amount || 0;
  // Net: positive means they owe me, negative means I owe them
  const net = owedToMe - iOwe;
  if (net !== 0) {
    netBalances[b.id] = net;
  }
});
const netMembers = Object.entries(netBalances)
  .map(([id, amount]) => ({ ...userMap[id], amount }))
  .sort((a, b) => b.amount - a.amount);

  // Who owes me?
  const owedByMembers = me.owedBy
    .map(({ from, amount }) => ({ ...userMap[from], amount }))
    .sort((a, b) => b.amount - a.amount);

  // Whom do I owe?
  const owingToMembers = me.owes
    .map(({ to, amount }) => ({ ...userMap[to], amount }))
    .sort((a, b) => b.amount - a.amount);

  const isAllSettledUp =
    me.totalBalance === 0 &&
    owedByMembers.length === 0 &&
    owingToMembers.length === 0;

  /* ───── UI ────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-4">
        {/* Current user's total balance */}
        <div className="text-center pb-4 border-b">
            <p className="text-sm text-muted-foreground mb-1">Your balance</p>
            <p
            className={`text-2xl font-bold ${
                me.totalBalance > 0
                ? "text-green-600"
                : me.totalBalance < 0
                    ? "text-red-600"
                    : ""
            }`}
            >
            {me.totalBalance > 0
                ? `+Rs ${me.totalBalance.toFixed(2)}`
                : me.totalBalance < 0
                ? `-Rs ${Math.abs(me.totalBalance).toFixed(2)}`
                : "Rs 0.00"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
            {me.totalBalance > 0
                ? "You are owed money"
                : me.totalBalance < 0
                ? "You owe money"
                : "You are all settled up"}
            </p>
        </div>

        {netMembers.length === 0 ? (
            <div className="text-center py-4">
            <p className="text-muted-foreground">Everyone is settled up!</p>
            </div>
        ) : (
            <div className="space-y-3">
            {netMembers.map((member) => (
            <div
                key={member.id}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback>
                    {member.name?.charAt(0) ?? "?"}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm">{member.name}</span>
                </div>
                <div className="flex flex-col items-end">
                <span className={`font-medium ${member.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {member.amount > 0
                    ? `Rs ${member.amount.toFixed(2)}`
                    : `Rs ${Math.abs(member.amount).toFixed(2)}`}
                </span>
                <span className="text-xs text-muted-foreground">
                    {member.amount > 0
                    ? `${member.name} has to pay you`
                    : `You have to pay ${member.name}`}
                </span>
                </div>
            </div>
            ))}
            </div>
        )}
        </div>
  );
}