import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, ShieldAlert, Lock, ArrowRight, ArrowLeft, Loader2, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

type SearchParams = { token?: string; redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    token: search.token as string | undefined,
    redirect: search.redirect as string | undefined,
  }),
  component: LoginComponent,
});

function LoginComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { loginWithToken, registerPatient, loginPatient, loginAdmin, user, isLoading: authLoading } = useAuth();

  const [isPatientLogin, setIsPatientLogin] = useState(true); // true=login, false=register
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Patient form
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [patientConfirmPassword, setPatientConfirmPassword] = useState("");

  // Admin form
  const [adminEmail, setAdminEmail] = useState("admin@drmadhurana.com");
  const [adminPassword, setAdminPassword] = useState("");

  // Handle Google OAuth callback token
  useEffect(() => {
    if (search.token) {
      loginWithToken(search.token);
      toast.success("Successfully signed in with Google!");
      navigate({ to: "/patient" });
    }
  }, [search.token, loginWithToken, navigate]);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && !search.token) {
      const dest = user.role === "doctor" ? "/doctor" : "/patient";
      navigate({ to: dest });
    }
  }, [user, authLoading, navigate, search.token]);

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = "https://drmadhurana-consult-booking-backend-production.up.railway.app/oauth2/authorization/google";
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isPatientLogin) {
        if (!patientEmail || !patientPassword) {
          toast.error("Please enter email and password.");
          setIsSubmitting(false);
          return;
        }
        await loginPatient(patientEmail, patientPassword);
        toast.success("Welcome back!");
      } else {
        if (!patientName || !patientEmail || !patientPassword) {
          toast.error("Please fill in all fields.");
          setIsSubmitting(false);
          return;
        }
        if (patientPassword.length < 6) {
          toast.error("Password must be at least 6 characters.");
          setIsSubmitting(false);
          return;
        }
        if (patientPassword !== patientConfirmPassword) {
          toast.error("Passwords do not match.");
          setIsSubmitting(false);
          return;
        }
        await registerPatient(patientName, patientEmail, patientPassword);
        toast.success("Account created successfully!");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      toast.error("Please enter email and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      await loginAdmin(adminEmail, adminPassword);
      toast.success("Welcome back, Prof. Dr. Madhu!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid admin credentials";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/15 px-4 py-12 relative">
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Stethoscope className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            Medical Portal
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Access consultations and patient management
          </p>
        </div>

        <Tabs defaultValue="patient" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient Portal</TabsTrigger>
            <TabsTrigger value="doctor">Doctor/Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <Card className="border-border/60 shadow-lg backdrop-blur-sm bg-card/90">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold">
                  {isPatientLogin ? "Patient Login" : "Patient Registration"}
                </CardTitle>
                <CardDescription>
                  {isPatientLogin
                    ? "Sign in to view your consultations and book appointments."
                    : "Create a new account to get started with your consultations."}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* Google Sign-In */}
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full py-6 flex items-center justify-center gap-3 border-border hover:bg-accent/40"
                  disabled={isGoogleLoading || isSubmitting}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28-0.96,2.37-2.04,3.1v2.58h3.3c1.93-1.78 3.04-4.4 3.04-7.48C21.68,11.89 21.56,11.45 21.35,11.1z" fill="#4285F4" />
                      <path d="M12,20.88c2.4,0 4.4-0.8 5.88-2.18l-3.3-2.58c-0.9,0.6-2.07,0.98-3.37,0.98-2.6,0-4.8-1.75-5.58-4.12H2.2v2.66C3.68,18.57 7.6,20.88 12,20.88z" fill="#34A853" />
                      <path d="M6.42,12.98c-0.2-0.6-0.31-1.24-0.31-1.9c0-0.66 0.11-1.3 0.31-1.9V6.52H2.2C1.49,7.9 1.1,9.45 1.1,11.08c0,1.63 0.39,3.18 1.1,4.56L6.42,12.98z" fill="#FBBC05" />
                      <path d="M12,5.2c1.3,0 2.48,0.45 3.4,1.32l2.55-2.55C16.4,2.57 14.4,1.3 12,1.3 7.6,1.3 3.68,3.61 2.2,6.52l4.22,3.28C7.2,7.43 9.4,5.2 12,5.2z" fill="#EA4335" />
                    </svg>
                  )}
                  <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or use email</span>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handlePatientSubmit} className="space-y-3">
                  {!isPatientLogin && (
                    <div className="space-y-1.5">
                      <Label htmlFor="p-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="p-name" placeholder="Rahul Sharma" className="pl-9" value={patientName} onChange={(e) => setPatientName(e.target.value)} disabled={isSubmitting} />
                      </div>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="p-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="p-email" type="email" placeholder="you@example.com" className="pl-9" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p-pass">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="p-pass" type="password" placeholder="••••••" className="pl-9" value={patientPassword} onChange={(e) => setPatientPassword(e.target.value)} disabled={isSubmitting} />
                    </div>
                  </div>
                  {!isPatientLogin && (
                    <div className="space-y-1.5">
                      <Label htmlFor="p-confirm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="p-confirm" type="password" placeholder="••••••" className="pl-9" value={patientConfirmPassword} onChange={(e) => setPatientConfirmPassword(e.target.value)} disabled={isSubmitting} />
                      </div>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleLoading}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isPatientLogin ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  {isPatientLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsPatientLogin(!isPatientLogin)}
                    className="text-primary font-medium hover:underline underline-offset-2"
                  >
                    {isPatientLogin ? "Register here" : "Sign in"}
                  </button>
                </p>

                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Your data is securely stored and encrypted on our servers.</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctor">
            <Card className="border-border/60 shadow-lg backdrop-blur-sm bg-card/90">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold">Doctor &amp; Admin Sign-in</CardTitle>
                <CardDescription>
                  Enter your admin credentials to access the management dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="admin-email" type="email" className="pl-9" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-pass">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="admin-pass" type="password" placeholder="••••••••" className="pl-9" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} disabled={isSubmitting} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Enter Dashboard</span><ArrowRight className="h-4 w-4" /></>}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Default: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground font-semibold">admin@drmadhurana.com</code> / <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground font-semibold">admin1234</code>
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
