import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hotel, Loader2, ShieldCheck } from "lucide-react";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.register({ name, email, password, role, phone }, adminSecret);
      toast.success(response.message);

      if (role === 'admin') {
        setLocation("/login"); // Admin is auto-verified
      } else {
        setLocation(`/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
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
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">Create an Account</h1>
          <p className="text-muted-foreground">Join our exclusive community.</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              className="h-12"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="h-12"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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

          <div className="space-y-3 pt-2">
            <Label>I am signing up as:</Label>
            <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`flex items-center space-x-2 border p-3 rounded-xl cursor-pointer transition-colors ${role === 'user' ? 'border-primary bg-primary/5' : 'bg-muted/20'}`}>
                <RadioGroupItem value="user" id="r3" />
                <Label htmlFor="r3" className="cursor-pointer text-sm font-medium">Customer</Label>
              </div>
              <div className={`flex items-center space-x-2 border p-3 rounded-xl cursor-pointer transition-colors ${role === 'owner' ? 'border-primary bg-primary/5' : 'bg-muted/20'}`}>
                <RadioGroupItem value="owner" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer text-sm font-medium">Property Owner</Label>
              </div>
              <div className={`flex items-center space-x-2 border p-3 rounded-xl cursor-pointer transition-colors ${role === 'admin' ? 'border-primary bg-primary/5' : 'bg-muted/20'}`}>
                <RadioGroupItem value="admin" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer text-sm font-medium">Super Admin</Label>
              </div>
            </RadioGroup>
          </div>

          {role === 'admin' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="adminSecret" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Admin Secret Key
              </Label>
              <Input
                id="adminSecret"
                type="password"
                placeholder="Enter admin secret to verify"
                className="h-12 border-accent/50 focus:border-accent"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 mt-6" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login"><a className="text-primary font-semibold hover:text-accent transition-colors">Sign in</a></Link>
        </div>
      </div>
    </div>
  );
}
