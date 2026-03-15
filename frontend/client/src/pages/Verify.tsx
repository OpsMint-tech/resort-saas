import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Hotel, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get("email");

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      toast.error("Email is missing. Please try registering again.");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyOTP({ email, otp });
      toast.success("Account verified successfully! You can now login.");
      setLocation("/login");
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired OTP");
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
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">Verify Your Account</h1>
          <p className="text-muted-foreground">We've sent a 6-digit code to <span className="font-semibold text-primary">{email}</span></p>
        </div>

        <form className="space-y-8" onSubmit={handleVerify}>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
                <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
            disabled={loading || otp.length !== 6}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Verify & Continue
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button className="text-primary font-semibold hover:text-accent transition-colors">Resend Code</button>
        </div>
      </div>
    </div>
  );
}
