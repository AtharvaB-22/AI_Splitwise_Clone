"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import CardContent from "@geist-ui/react/esm/card/card-content";
import { ChevronRight, PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BarLoader } from "react-spinners";
import ExpenseSummary from "./components/expense-summary";
import BalanceSummary from "./components/balance-summary";
import GroupList from "./components/group-list";

const DashboardPage = () => {
    const {data: balances, isLoading: balancesLoading} = useConvexQuery(
        api.dashboard.getUserBalances
    );

    const {data: groups, isLoading: groupsLoading} = useConvexQuery(
        api.dashboard.getUserGroups
    );

    const { data: totalSpent, isLoading: totalSpentLoading } = useConvexQuery(
        api.dashboard.getTotalSpent
    );

    const { data: monthlySpending, isLoading: monthlySpendingLoading } = useConvexQuery(
        api.dashboard.getMonthlySpending
    );

    const isLoading =
        balancesLoading ||
        groupsLoading ||
        totalSpentLoading ||
        monthlySpendingLoading;

    return (
    <div className="container mx-auto py-6 space-y-6">
      {isLoading ? (
        <div className="w-full py-12 flex justify-center">
          <BarLoader width={"130%"} color="#356070" />
        </div>
      ) : (
        <>
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-5xl gradient-title font-extrabold gradient">
            Dashboard
        </h1>
        <Button
        asChild={false}
        onClick={() => window.location.href = "/expenses/new"}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md"
        >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Expense
        </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground"> 
                        Total Balance 
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {balances.totalBalance>0 ?(
                            <span className="text-green-600 text-2xl font-bold">
                                +Rs {balances?.totalBalance.toFixed(2)}
                            </span>
                        ) : balances?.totalBalance<0 ? (
                            <span className="text-red-600 text-2xl font-bold">
                                -Rs {Math.abs(balances?.totalBalance).toFixed(2)}
                            </span>
                        ) : (
                            <span className="text-gray-600 text-2xl font-bold">
                                Rs 0.00
                            </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {balances?.totalBalance> 0 ? "You are to recieve money"
                        : balances?.totalBalance<0 ? "You owe money": 
                        "You are settled up!"}
                      </p>
                </CardContent>
            </Card> 

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground"> 
                    You are owed
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                    Rs {balances?.youAreOwed.toFixed(2)}
                    </div>  
                    {/* <p className="text-xs text-muted-foreground mt-1">
                    From {balances?.ownDetails?.youAreOwedBy?.length || 0} people
                    </p>   */}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground"> 
                    You owe
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {balances?.oweDetails?.youOwe?.length > 0 && balances?.youOwe > 0 ? (
                    <>
                        <div className="text-2xl font-bold text-red-600">
                        Rs {balances?.youOwe.toFixed(2)}
                        </div>
                        {/* <p className="text-xs text-muted-foreground mt-1">
                        To {balances?.oweDetails?.youOwe?.length || 0} people
                        </p> */}
                    </>
                    ) : (
                    <>
                        <div className="text-2xl font-bold text-gray-600">
                        Rs 0.00
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                        You don't owe anyone
                        </p>
                    </>
                    )}
                </CardContent>
                </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
            <div className="lg:col-span-2 space-y-6">
                    {/* Expense Summary */}
                <ExpenseSummary
                monthlySpending={monthlySpending}
                totalSpent={totalSpent}
                />
            </div>
            <div className="space-y-6">
                    {/* Balance Details */}
                <Card>
                <CardHeader className="pb-3 flex items-center justify-between">
                    <CardTitle>Balance Details</CardTitle>
                    <Button variant="link" asChild className="p-0">
                    <Link href="/contacts">
                        View all
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <BalanceSummary balances={balances} />
                </CardContent>
                </Card>
                    {/* Groups */}
                <Card>
                <CardHeader className="pb-3 flex items-center justify-between">
                    <CardTitle>Your Groups</CardTitle>
                    <Button variant="link" asChild className="p-0">
                    <Link href="/contacts">
                        View all
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <GroupList groups={groups} />
                </CardContent>
                <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/contacts?createGroup=true">
                            <Users className="mr-2 h-4 w-4" />
                            Create New Group
                        </Link>
                    </Button>
                </CardFooter>
                </Card>
            </div>
        </div>
    </>
      )}
    </div>
  );
};

export default DashboardPage;