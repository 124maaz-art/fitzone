import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "FitZone's terms and conditions for website usage and membership services.",
};

export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="text-3xl font-black sm:text-4xl">Terms of Service</h1>
      <p className="mt-1 text-sm text-muted">Last updated: {new Date().getFullYear()}</p>
      <div className="mt-8 space-y-6 text-muted">
        <section>
          <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing the FitZone website or using our services, you agree to be bound by these terms
            and conditions. If you do not agree, please do not use our services.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground">2. Bookings and Memberships</h2>
          <p className="mt-2">
            Bookings are subject to availability. All memberships are billed as described at the time of
            purchase. We reserve the right to modify or discontinue any service or membership at our
            discretion.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground">3. User Responsibilities</h2>
          <p className="mt-2">
            You agree to provide accurate information when booking and to use our facilities in a safe and
            responsible manner. You are responsible for maintaining the confidentiality of any account
            credentials.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground">4. Limitations of Liability</h2>
          <p className="mt-2">
            FitZone is not liable for any indirect, incidental or consequential damages arising from the
            use of our website or services. Your use of the facility is at your own risk.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground">5. Contact</h2>
          <p className="mt-2">For questions about these terms, contact us at {settings.email}.</p>
        </section>
      </div>
      <div className="mt-8">
        <Link href="/" className={buttonVariants()}>Back to Home</Link>
      </div>
    </div>
  );
}
