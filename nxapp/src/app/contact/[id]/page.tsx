import { Suspense } from "react";
import ContactDetail from "@/components/ContactDetail";

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactDetail />
    </Suspense>
  );
}
