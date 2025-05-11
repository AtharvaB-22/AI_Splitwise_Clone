import { Bell, CreditCard, PieChart, Receipt, Users } from "lucide-react";

export const ICONS = {
  Users,
  CreditCard,
  PieChart,
  Bell,
  Receipt,
  CustomIcon: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 14v8M15 14v8M9 2v6M15 2v6" />
    </svg>
  ),
};

export const FEATURES = [
  {
    title: "Group Expenses",
    icon: "Users",
    bg: "bg-green-100",
    color: "text-green-600",
    description:
      "Create groups for roommates, trips, or events to keep expenses organized.",
  },
  {
    title: "Smart Settlements",
    icon: "CreditCard",
    bg: "bg-teal-100",
    color: "text-teal-600",
    description:
      "Our algorithm minimises the number of payments when settling up.",
  },
  {
    title: "Expense Analytics",
    icon: "PieChart",
    bg: "bg-green-100",
    color: "text-green-600",
    description:
      "Track spending patterns and discover insights about your shared costs.",
  },
  {
    title: "Payment Reminders",
    icon: "Bell",
    bg: "bg-amber-100",
    color: "text-amber-600",
    description:
      "Automated reminders for pending debts and insights on spending patterns.",
  },
  {
    title: "Multiple Split Types",
    icon: "Receipt",
    bg: "bg-green-100",
    color: "text-green-600",
    description:
      "Split equally, by percentage, or by exact amounts to fit any scenario.",
  },
  {
    title: "Real‑time Updates",
    icon: "CustomIcon", // Reference the custom inline icon
    bg: "bg-teal-100",
    color: "text-teal-600",
    description:
      "See new expenses and repayments the moment your friends add them.",
  },
];