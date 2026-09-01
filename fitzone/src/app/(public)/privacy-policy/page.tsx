import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "FitZone's privacy policy explaining how we collect, use and protect your personal information.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();
  return (
    <div className="container-page max-w-3xl py-16 prose-sm">
      <h1 className="text-3xl font-black sm:text-4xl">Privacy Policy</h1>
      <p className="mt-1 text-sm text-muted">Last updated: {new Date().getFullYear()}</p>
      <div className="mt-8 space-y-6 text-muted">
        <section>
          <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
          <p className="mt-2">
            When you use our website or book a session, we may collect your name, email address, phone
            number, WhatsApp number, fitness goals and booking details. We collect this information to
            provide our services effectively.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
          <p className="mt-2">
            We use your information to process bookings, respond to inquiries, improve our services and
            communicate important updates. We never sell your personal data to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground">3. Data Security</h2>
          <p className="mt-2">
            We implement appropriate technical and organizational measures to protect your personal data
            against unauthorized access, alteration or loss. Passwords are securely hashed and never
            stored in plain text.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground">4. Your Rights</h2>
          <p className="mt-2">
            You have the right to access, correct or request deletion of your personal data at any time.
            To exercise these rights, please contact us using the details below.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground">5. Contact Us</h2>
          <p className="mt-2">
            If you have any questions about this privacy policy, please contact us at {settings.email}.
          </p>
        </section>
      </div>
      <div className="mt-8">
        <Link href="/" className={buttonVariants()}>Back to Home</Link>
      </div>
    </div>
  );
}
