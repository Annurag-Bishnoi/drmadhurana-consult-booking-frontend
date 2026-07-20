import { Link } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Stethoscope className="h-5 w-5" />
            </span>
            <div className="font-semibold">Dr. Loverpreet Singh</div>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Trusted online surgical consultations via secure chat, voice and video. Serving 10,000+ patients across India.
          </p>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Quick Links</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Consultations</Link></li>
            <li><Link to="/book" className="hover:text-foreground">Book Now</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Contact</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>care@drloverpreet.in</li>
            <li>+91 80000 12345</li>
            <li>Mohali, Punjab</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dr. Loverpreet Singh. All rights reserved.
      </div>
    </footer>
  );
}
