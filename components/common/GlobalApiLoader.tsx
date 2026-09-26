"use client";

import { useEffect, useState } from "react";
import { apiLoading } from "@/services/apiLoading";
import { LinearProgress } from "@mui/material";

export default function GlobalApiLoader() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => apiLoading.subscribe(setIsLoading), []);

    if (!isLoading) return null;

    return (
        <div className="global-api-loader" role="status" aria-label="Loading">
            <LinearProgress className="global-api-progress" color="primary" aria-label="Loading" />
        </div>
    );
}