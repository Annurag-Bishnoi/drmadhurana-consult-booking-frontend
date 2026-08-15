import { Link } from "@tanstack/react-router";
import { Stethoscope, Instagram, Mail, Facebook, Linkedin, MapPin, Phone } from "lucide-react";
import { doctor } from "@/data/mock";

export function PublicFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Stethoscope className="h-5 w-5" />
            </span>
            <div className="font-semibold">{doctor.name}</div>
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
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2 hover:text-foreground transition-colors"><Mail className="h-4 w-4" /> maadhurrana@gmail.com</li>
            <li className="flex items-center gap-2 hover:text-foreground transition-colors"><Phone className="h-4 w-4" /> +91 7351025135</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Dehradun, Uttarakhand</li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Legal</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Socials</div>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:bg-[#1877F2] hover:text-white transition-all">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-all">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {doctor.name}. All rights reserved.
      </div>
    </footer>
  );
}
