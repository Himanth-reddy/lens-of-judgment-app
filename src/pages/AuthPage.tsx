import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, EyeOff, Mail, Lock, User, Film, Sparkles, Star, Clapperboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LOJLogo from "@/components/LOJLogo";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "You've been signed in successfully." });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/5 rounded-full blur-[150px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </div>

      {/* Floating film elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Film className="absolute top-[10%] left-[8%] text-primary/10 animate-float" size={40} style={{ animationDelay: "0s" }} />
        <Star className="absolute top-[20%] right-[12%] text-accent/10 animate-float" size={32} style={{ animationDelay: "1s" }} />
        <Clapperboard className="absolute bottom-[15%] left-[15%] text-teal/10 animate-float" size={36} style={{ animationDelay: "2s" }} />
        <Sparkles className="absolute bottom-[25%] right-[10%] text-primary/10 animate-float" size={28} style={{ animationDelay: "0.5s" }} />
        <Film className="absolute top-[60%] left-[5%] text-accent/8 animate-float" size={24} style={{ animationDelay: "1.5s" }} />
        <Star className="absolute top-[8%] right-[35%] text-teal/8 animate-float" size={20} style={{ animationDelay: "2.5s" }} />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <LOJLogo />
          <p className="text-muted-foreground text-sm mt-2 tracking-widest uppercase">Lens of Judgment</p>
        </div>

        <div className="relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
          {/* Glow border effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-accent/50 to-teal/50 rounded-2xl blur-sm opacity-60" />
          
          <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
            {/* Toggle */}
            <div className="flex mb-8 bg-secondary/50 rounded-xl p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isLogin
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  !isLogin
                    ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="username" className="text-sm text-muted-foreground">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="cinephile42"
                      className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50 h-12 rounded-xl"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-secondary/30 border-border/50 focus:border-primary/50 h-12 rounded-xl"
                    required
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showPassword ? "Hide password" : "Show password"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} />
                    {isLogin ? "Sign In" : "Create Account"}
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
