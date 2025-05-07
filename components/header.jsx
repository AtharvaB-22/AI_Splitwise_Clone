"use client";

import { useStoreUser } from "@/hooks/use-store-user";
import { SignedOut, SignInButton, SignUpButton, UserButton, SignedIn } from "@clerk/nextjs";
import React from "react";

const Header = () => {

    const {isLoading} = useStoreUser();
    
    return (
        <div>
            <SignedOut>
                <SignInButton />
                <SignUpButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>

        </div>
    );
  };
  
  export default Header;