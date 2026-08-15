import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      <main className="mx-auto flex-1 max-w-3xl px-4 py-16 sm:px-6 w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground">Last updated: August 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as your name, email address, phone number, and medical history when you register for an account or book a consultation.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>Your information is used to facilitate medical consultations, maintain your health records, process payments, and communicate with you regarding your appointments and our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Security and Privacy</h2>
            <p>We implement strict security measures to protect your personal and medical information. All video, voice, and chat consultations are encrypted, and your medical records are stored securely in compliance with applicable healthcare data protection regulations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Sharing of Information</h2>
            <p>We do not sell your personal information to third parties. We may share your information only with authorized medical professionals involved in your care or when required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
            <p>You have the right to access, update, or request the deletion of your personal and medical information. If you wish to exercise these rights, please contact us.</p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
