"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const ContactFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

export async function submitContactMessage(data: ContactFormData) {
    const result = ContactFormSchema.safeParse(data);

    if (!result.success) {
        return { success: false, error: "Invalid form data" };
    }

    const { name, email, subject, message } = result.data;

    // Split name into first and last name for the table logic if needed, 
    // or just store as is if the table is flexible. 
    // The SQL provided was: first_name, last_name. 
    // Let's split the name.
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("contact_messages")
            .insert({
                first_name: firstName,
                last_name: lastName,
                email,
                subject,
                message,
            });

        if (error) {
            console.error("Supabase error:", error);
            return { success: false, error: "Failed to save message." };
        }

        return { success: true };
    } catch (error) {
        console.error("Server action error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
