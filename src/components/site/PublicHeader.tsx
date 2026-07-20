import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Stethoscope, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PublicHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">Dr. Loverpreet Singh</div>
            <div className="text-[11px] text-muted-foreground">General &amp; Laparoscopic Surgeon</div>
          </div>
        </Link>
        
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} inactiveProps={{ className: "text-muted-foreground" }} className="hover:text-foreground">Home</Link>
          <Link to="/about" activeProps={{ className: "text-foreground" }} inactiveProps={{ className: "text-muted-foreground" }} className="hover:text-foreground">About</Link>
          <Link to="/services" activeProps={{ className: "text-foreground" }} inactiveProps={{ className: "text-muted-foreground" }} className="hover:text-foreground">Consultations</Link>
          
          {user && (
            <Link 
              to={user.role === "doctor" ? "/doctor" : "/patient"} 
              activeProps={{ className: "text-foreground font-semibold" }} 
              inactiveProps={{ className: "text-muted-foreground" }} 
              className="hover:text-foreground"
            >
              {user.role === "doctor" ? "Doctor Portal" : "My Dashboard"}
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to={user.role === "doctor" ? "/doctor" : "/patient"} className="flex items-center gap-2">
                <Avatar className="h-8 w-8 hover:ring-2 hover:ring-primary transition-all">
                  {user.picture ? <AvatarImage src={user.picture} alt={user.name} /> : null}
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium hover:text-primary transition-colors">{user.name}</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login / Portal</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/login" search={{ redirect: "/patient" }}>Book Consultation</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}