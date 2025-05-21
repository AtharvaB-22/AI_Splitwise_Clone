import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

const SettlementsList = ({
  settlements,
  isGroupSettlement = false,
  userLookupMap = {},
}) => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  if (!settlements || !settlements.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No settlements found
        </CardContent>
      </Card>
    );
  }

  const getUserDetails = (userId) => ({
    name: userId === currentUser?._id
      ? "You"
      : userLookupMap[userId]?.name || "Other User",
    imageUrl: userLookupMap[userId]?.imageUrl || null,
    id: userId,
  });

  return (
    <div className="flex flex-col gap-4">
      {settlements.map((settlement) => {
        const payer = getUserDetails(settlement.paidByUserId);
        const receiver = getUserDetails(settlement.receivedByUserId);
        const isCurrentUserPayer = settlement.paidByUserId === currentUser?._id;
        const isCurrentUserReceiver = settlement.receivedByUserId === currentUser?._id;

        return (
          <Card
            className="hover:bg-muted/30 transition-colors"
            key={settlement._id}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                {/* Left: Avatars and info */}
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ArrowLeftRight className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-muted">
                      <AvatarFallback className="text-xs font-semibold">
                        {payer.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{payer.name}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <Avatar className="h-8 w-8 bg-muted">
                      <AvatarFallback className="text-xs font-semibold">
                        {receiver.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{receiver.name}</span>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <span>
                        {format(new Date(settlement.date), "MMM d, yyyy")}
                      </span>
                      {settlement.note && (
                        <>
                          <span>•</span>
                          <span>{settlement.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Right: Amount and status */}
                <div className="flex flex-col items-end min-w-[120px]">
                  <div className="font-medium text-lg">
                    Rs {settlement.amount.toFixed(2)}
                  </div>
                  {isGroupSettlement ? (
                    <Badge variant="outline" className="mt-1">
                      Group settlement
                    </Badge>
                  ) : isCurrentUserPayer ? (
                    <span className="text-xs text-green-600 mt-1">You paid</span>
                  ) : isCurrentUserReceiver ? (
                    <span className="text-xs text-primary mt-1">You received</span>
                  ) : (
                    <span className="text-xs text-muted-foreground mt-1">Payment</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SettlementsList;