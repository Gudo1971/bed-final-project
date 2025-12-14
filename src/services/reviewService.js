import { toVarReference } from "@chakra-ui/react";

export async function createReview(reviewData){
    const response = await fetch ("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
        throw new Error ( "Failed to create review");

    }
    return response.json();
        }
    