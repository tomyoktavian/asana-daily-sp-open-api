"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Blocks, ChevronRight, Loader2, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { cn } from "@/lib/utils";

export default function Home() {
  const [token, setToken] = useState("2/1201927017294106/1211547354542943:550a9498f866c95b5488e9e9fde445c6");
  // const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/set-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Token tidak valid");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Asana Task Report
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Pantau progres task dengan mudah dan efisien
            </p>
          </div>

          <div className="group cursor-pointer mb-6 w-max relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
            <span
              className={cn(
                "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <Blocks className="w-4 h-4 text-blue-500"/>
            <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Dapatkan Ekstensi untuk VSCode
            </AnimatedGradientText>
            <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </div>

          <Card className="max-w-md mx-auto mb-12">
            <CardHeader>
              <CardTitle>Login dengan Personal Access Token</CardTitle>
              <CardDescription>
                Masukkan token Asana untuk mengakses dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Personal Access Token</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Masukkan token Asana kamu di sini"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Dapatkan token di:{" "}
                    <a
                      href="https://app.asana.com/0/my-apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Asana Developer Console
                    </a>
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    "Masuk ke Dashboard"
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Referensi API di:{" "}
                <a
                  href="https://developers.asana.com/reference/tasks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Asana open API
                </a>
              </p>
            </CardContent>
          </Card>

          <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
              <Image
                className="bg-background aspect-16/11 relative hidden rounded-2xl dark:block"
                src="/img/dark-banner.jpg"
                alt="Asana Dashboard Preview - Dark Mode"
                width="2700"
                height="1440"
              />
              <Image
                className="z-2 border-border/25 aspect-16/11 relative rounded-2xl border dark:hidden"
                src="/img/light-banner.jpg"
                alt="Asana Dashboard Preview - Light Mode"
                width="2700"
                height="1440"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
