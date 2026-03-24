import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import PageLoader from "@/components/layouts/loader/page-loader";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { db } from "@/lib/db";
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const { isLoading, user } = db.useAuth()
  const navigator = useNavigate();



  const handleSendCode = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      setError("Email field is required!")
      return;
    }
    setLoading(true)
    try {
      await db.auth.sendMagicCode({ email: email.trim() });
      setSentTo(email.trim());
      toast.success("Magic code sent! Check your email.");
    } catch (err: any) {
      toast.error("Failed to send code. Please try again.");
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      toast.error("Please enter the code");
      return;
    }
    setLoading(true);
    try {
      await db.auth.signInWithMagicCode({ email: sentTo, code: code.trim() });
      toast.success("Signed in successfully!");
      window.location.href = "/profile";
    } catch (err: any) {
      toast.error("Invalid code. Please try again.");
      setError(err.message || "Invalid otp code");
    } finally {
      setLoading(false);
    }
  };


  if (isLoading) return <PageLoader />
  if (user) {
    navigator({ to: '/' });
    return;
  }

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-3">
        <Link className="my-2" to="/">
          <Button className="self-start" variant={'ghost'}><ArrowLeft /> Back to home</Button>
        </Link>
        <div className="space-y-4 border p-6">
          {
            !sentTo ? (
              <>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendCode()
                      }
                    }}
                    id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" type="email" />
                  <FieldDescription>
                    Enter a valid email where we send a magic code.
                  </FieldDescription>
                  {error && <FieldError errors={[{ message: error }]} />}
                </Field>
                <Button onClick={handleSendCode} className="cursor-pointer">
                  {loading ? (
                    <>
                      Sending
                      <Loader className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Send OTP <ArrowRight />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Field>
                  <FieldLabel>Magic Code</FieldLabel>
                  <FieldContent className="flex items-center justify-center">
                    <InputOTP
                      disabled={loading}
                      value={code}
                      onComplete={handleVerifyCode}
                      onChange={setCode}
                      maxLength={6}
                      autoFocus
                    >
                      <InputOTPGroup>
                        <InputOTPSlot autoFocus index={0} aria-invalid={error ? "true" : "false"} />
                        <InputOTPSlot index={1} aria-invalid={error ? "true" : "false"} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} aria-invalid={error ? "true" : "false"} />
                        <InputOTPSlot index={3} aria-invalid={error ? "true" : "false"} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} aria-invalid={error ? "true" : "false"} />
                        <InputOTPSlot index={5} aria-invalid={error ? "true" : "false"} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FieldContent>
                  <FieldDescription>
                    Check your {sentTo} inbox (also check spam mail) where we sent a 6-digit code.
                  </FieldDescription>
                </Field>
                <Button
                  type="button"
                  variant="link"
                  className="w-full text-sm mt-6"
                  onClick={() => { setSentTo(""); setCode(""); }}
                >
                  Use a different email
                </Button>
              </>
            )
          }
        </div>
      </div>
    </main>
  );
}
