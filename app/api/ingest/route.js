import { inngest } from "@/lib/ingest/client";
import { serve } from "ingest/next";


export const { GET, POST , PUT } = serve({ 
    client: inngest,
    functions: [
        
    ],
});