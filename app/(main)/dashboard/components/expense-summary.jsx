import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@geist-ui/react";
import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";

const ExpenseSummary = ({ monthlySpending = [], totalSpent = 0 }) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const yearlyTotal = monthlySpending.reduce((sum, m) => sum + (m.total || 0), 0);

  // Prepare chart data for each month
  const chartData = monthlySpending.map((item, idx) => ({
  month: monthNames[idx],
  total: item.total,
}));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-xl p-6 flex flex-col justify-center items-start">
            <p className="text-base text-muted-foreground font-medium mb-1">Total this month</p>
            <h3 className="text-3xl font-semibold text-neutral-700">
            Rs {monthlySpending?.[currentMonth]?.total?.toFixed(2) || "0.00"}
            </h3>
        </div>
        <div className="bg-white shadow rounded-xl p-6 flex flex-col justify-center items-start">
            <p className="text-base text-muted-foreground font-medium mb-1">Total this year</p>
            <h3 className="text-3xl font-semibold text-neutral-700">
            Rs {yearlyTotal.toFixed(2)}
            </h3>
        </div>
        </div>
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip
                formatter={(value) => [`Rs{Number(value).toFixed(2)}`, "Amount"]}
                labelFormatter={(label) => `Spending in ${label}`}
              />
              <Bar
                dataKey="total"
                fill="#36d7b7"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
            Monthly Spending for {currentYear}
        </p>
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;