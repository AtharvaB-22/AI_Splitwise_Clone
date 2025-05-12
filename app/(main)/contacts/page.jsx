"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

const ContactsPage = () => {
    const data = useQuery(api.contacts.getAllContacts);

    // Log the data in a readable format
    console.log("Contacts Data:", JSON.stringify(data, null, 2));

    return (
        <div>
            <h1>Contacts Page</h1>
        </div>
    );
};

export default ContactsPage;