"use client";

import { Authenticated } from "convex/react";
import React from "react";

const MainLayout = ({ children }) => {
    return (
        <Authenticated>
            <div className="container mx-auto mt-24 mb-20 px-4 sm:px-6 lg:px-8">
                {children} {/* This renders the nested pages */}
            </div>
        </Authenticated>
    );
};

export default MainLayout;