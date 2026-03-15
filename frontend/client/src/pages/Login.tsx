import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hotel, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Force clear old session to prevent stale data issues
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success(`Welcome back, ${response.user.name}!`);

      // Redirect based on role
      if (response.user.role === 'admin') {
        setLocation("/admin/dashboard");
      } else if (response.user.role === 'owner') {
        setLocation("/owner/dashboard");
      } else {
        setLocation("/my-bookings");
      }
    } catch (error: any) {
      if (error.message === "Please verify your email first") {
        toast.info("Please verify your account to continue.");
        setLocation(`/verify?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 border border-border/50">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <a className="flex items-center gap-2 group">
              <Hotel className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
              <span className="font-serif text-2xl font-bold text-primary">LuxeStays</span>
            </a>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to manage your bookings.</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-accent hover:underline">Forgot password?</a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register"><a className="text-primary font-semibold hover:text-accent transition-colors">Create one</a></Link>
        </div>
      </div>
    </div>
  );
}
