import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { User, LogOut, LayoutDashboard, Hotel } from "lucide-react";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!token;
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href={userRole === 'admin' ? '/admin/dashboard' : userRole === 'owner' ? '/owner/dashboard' : '/'}>
          <a className="flex items-center gap-2 group">
            <Hotel className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
            <span className="font-serif text-2xl font-bold text-primary">LuxeStays</span>
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {userRole !== 'owner' && (
            <>
              <Link href="/"><a className={`transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>Destinations</a></Link>
              <Link href="/my-bookings"><a className={`transition-colors hover:text-primary ${location === '/my-bookings' ? 'text-primary' : 'text-muted-foreground'}`}>My Bookings</a></Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {userRole === 'admin' && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/dashboard"><LayoutDashboard className="h-4 w-4 mr-2" /> Admin</Link>
                </Button>
              )}
              {userRole === 'owner' && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/owner/dashboard"><LayoutDashboard className="h-4 w-4 mr-2" /> Owner Portal</Link>
                </Button>
              )}
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary max-w-[100px] truncate">{user?.name}</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/60 mr-2">{userRole}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:text-red-500 transition-colors">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
