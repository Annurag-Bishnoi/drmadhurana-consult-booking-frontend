import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/site/PublicHeader";
import { PublicFooter } from "@/components/site/PublicFooter";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      <main className="mx-auto flex-1 max-w-3xl px-4 py-16 sm:px-6 w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground">Last updated: August 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>Welcome to HealthConnect Pro. By accessing or using our telehealth platform, you agree to be bound by these Terms of Service. Please read them carefully.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Medical Advice Disclaimer</h2>
            <p>The information provided on this platform is for general informational purposes and should not be considered a substitute for professional medical advice, diagnosis, or treatment. In case of a medical emergency, please call your local emergency services immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Consultations and Prescriptions</h2>
            <p>All consultations are conducted by licensed medical professionals. The issuance of a prescription is at the sole discretion of the consulting doctor, based on their professional judgment and the information provided by the patient.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. User Responsibilities</h2>
            <p>You agree to provide accurate, current, and complete information during the registration and consultation process. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Payment and Refunds</h2>
            <p>Fees for consultations are clearly stated prior to booking. Refunds are subject to our cancellation policy, which requires at least 24 hours' notice for a full refund.</p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
