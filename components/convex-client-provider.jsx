"use client";

import {ConvexProvider, ConvexReactClient} from "convex/react";
//Convex can be used for self hosting as well
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({children}) {
  return (
    <ConvexProvider client={convex}
    // useAuth={}
    >
      {children}
    </ConvexProvider>
  );
}
