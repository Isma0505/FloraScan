"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Check, Chrome, Eye, EyeOff, Facebook, Instagram, KeyRound, Leaf, LogIn, LogOut, Mail, MessageCircle, User, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/store";
import { getCurrentUser, getPasswordStrength, loginUser, logoutUser, registerUser, updateUserPassword, updateUserProfile, type LocalUser } from "@/lib/auth";
import { toast } from "sonner";

export function AuthControl() {
  const t = useT();
  const [user, setUser] = useState<LocalUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  // Authentication state is browser-only and must be read after hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setUser(getCurrentUser());
  }, []);

  if (!mounted) return null;

  if (user) {
    return (
      <>
        <button onClick={() => setAccountOpen(true)} className="group flex items-center gap-2 rounded-xl border border-border/80 bg-background/60 px-2 py-1.5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
          <Avatar user={user} size="sm" />
          <span className="hidden max-w-24 truncate text-sm font-semibold sm:inline">{user.name}</span>
        </button>
        {accountOpen && typeof document !== "undefined" && createPortal(
          <AccountModal user={user} onClose={() => setAccountOpen(false)} onUpdated={setUser} />,
          document.body
        )}
      </>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2 rounded-lg">
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">{t.result.login}</span>
      </Button>
      {open && typeof document !== "undefined" && createPortal(
        <AuthModal
          mode={mode}
          setMode={setMode}
          onClose={() => setOpen(false)}
          onAuthenticated={(nextUser) => {
            setUser(nextUser);
            setOpen(false);
          }}
        />,
        document.body
      )}
    </>
  );
}

function AuthModal({
  mode,
  setMode,
  onClose,
  onAuthenticated,
}: {
  mode: "login" | "register";
  setMode: (mode: "login" | "register") => void;
  onClose: () => void;
  onAuthenticated: (user: LocalUser) => void;
}) {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (mode === "register" && password !== confirmPassword) throw new Error("PASSWORD_MISMATCH");
      const user = mode === "register"
        ? registerUser(name, email, password)
        : loginUser(email, password);
      toast.success(mode === "register" ? t.result.registerSuccess : t.result.loginSuccess);
      onAuthenticated(user);
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : "";
      toast.error(errorCode === "EMAIL_EXISTS" ? t.result.emailExists : errorCode === "PASSWORD_MISMATCH" ? t.result.passwordMismatch : errorCode === "WEAK_PASSWORD" ? t.result.weakPassword : t.result.authError);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex min-h-full items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="my-4 grid max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-white/20 bg-card/80 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:my-0 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[30rem] overflow-hidden bg-primary p-8 text-primary-foreground md:flex md:flex-col md:justify-between">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[24px] border-white/15" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full border-[32px] border-black/10" />
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur"><Leaf className="h-6 w-6" /></div>
          <div className="relative z-10 [transform:perspective(700px)_rotateY(-8deg)]">
            <p className="text-sm font-medium text-primary-foreground/70">FloraScan AI</p>
            <h3 className="mt-3 text-4xl font-black leading-[0.95]">{mode === "login" ? "Welcome back." : "Grow your profile."}</h3>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/75">{t.result.accountLocalNote}</p>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-xs font-semibold text-primary-foreground/80"><Check className="h-4 w-4" /> Plant knowledge, in one place</div>
        </div>
        <div className="relative p-6 sm:p-9">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground">{t.result.account}</p><h2 className="mt-1 text-2xl font-bold tracking-tight">{mode === "login" ? t.result.loginTitle : t.result.registerTitle}</h2></div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label={t.common.close}><X className="h-4 w-4" /></Button>
          </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "register" && <AuthField icon={User} value={name} onChange={setName} placeholder={t.result.name} />}
          <AuthField icon={Mail} type="email" value={email} onChange={setEmail} placeholder={t.result.email} />
          <PasswordField value={password} onChange={setPassword} placeholder={t.result.password} visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          {mode === "register" && <>
            <PasswordHint password={password} />
            <PasswordField value={confirmPassword} onChange={setConfirmPassword} placeholder={t.result.confirmPassword} visible={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
          </>}
          <Button type="submit" className="h-12 w-full gap-2 rounded-xl text-base shadow-lg shadow-primary/20 transition hover:-translate-y-0.5">
            {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {mode === "login" ? t.result.login : t.result.register}
          </Button>
        </form>
        <SocialLoginButtons />
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-center text-sm text-primary hover:underline"
        >
          {mode === "login" ? t.result.register : t.result.login}
        </button>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ value, onChange, placeholder, visible, onToggle }: { value: string; onChange: (value: string) => void; placeholder: string; visible: boolean; onToggle: () => void }) {
  return <div className="relative"><KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><Input className="h-12 rounded-xl bg-background/50 pl-10 pr-11" type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} minLength={6} required /><button type="button" onClick={onToggle} aria-label={visible ? "Sembunyikan kata sandi" : "Perlihatkan kata sandi"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><span className="sr-only">{visible ? "Sembunyikan kata sandi" : "Perlihatkan kata sandi"}</span>{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>;
}

function PasswordHint({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  const label = !password ? "Minimal 6 karakter" : strength === "weak" ? "Kata sandi terlalu lemah" : strength === "fair" ? "Kata sandi cukup kuat" : "Kata sandi kuat";
  const color = strength === "strong" ? "text-emerald-600" : strength === "fair" ? "text-amber-600" : "text-destructive";
  return <p className={`-mt-2 text-xs ${color}`}>{label}. Gunakan huruf besar, angka, dan simbol.</p>;
}

function SocialLoginButtons() {
  const providers = [[Chrome, "Google", "Google login memerlukan konfigurasi OAuth di Vercel."], [Facebook, "Facebook", "Facebook login memerlukan konfigurasi OAuth di Vercel."], [MessageCircle, "WhatsApp", "WhatsApp login memerlukan WhatsApp Business API dan OTP."], [Instagram, "Instagram", "Instagram tidak menyediakan login OAuth umum untuk aplikasi ini."]] as const;
  return <div className="mt-5 border-t border-border/70 pt-5"><p className="mb-3 text-center text-xs text-muted-foreground">Login sosial akan tersedia setelah provider dikonfigurasi</p><div className="grid grid-cols-2 gap-2">{providers.map(([Icon, label, hint]) => <button key={label} type="button" disabled title={hint} className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background/50 text-xs text-muted-foreground opacity-70"><Icon className="h-4 w-4" />{label}</button>)}</div></div>;
}

function AuthField({ icon: Icon, type = "text", value, onChange, placeholder }: { icon: typeof User; type?: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="relative"><Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><Input className="h-12 rounded-xl bg-background/50 pl-10" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} minLength={type === "password" ? 6 : undefined} required /></div>;
}

function Avatar({ user, size = "md" }: { user: LocalUser; size?: "sm" | "md" }) {
  return user.avatar ? <img src={user.avatar} alt={user.name} className={`${size === "sm" ? "h-7 w-7" : "h-20 w-20"} rounded-full object-cover ring-2 ring-primary/30`} /> : <div className={`${size === "sm" ? "h-7 w-7 text-xs" : "h-20 w-20 text-2xl"} flex items-center justify-center rounded-full bg-primary/15 font-bold text-primary ring-2 ring-primary/20`}>{user.name.charAt(0).toUpperCase()}</div>;
}

function AccountModal({ user, onClose, onUpdated }: { user: LocalUser; onClose: () => void; onUpdated: (user: LocalUser) => void }) {
  const t = useT();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      onUpdated(updateUserProfile(user.id, { name, email, avatar }));
      toast.success(t.result.profileUpdated);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      toast.error(message === "EMAIL_EXISTS" ? t.result.emailExists : t.result.profileError);
    }
  };

  const savePassword = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      onUpdated(updateUserPassword(user.id, currentPassword, newPassword));
      setCurrentPassword("");
      setNewPassword("");
      toast.success(t.result.passwordUpdated);
    } catch {
      toast.error(t.result.invalidPassword);
    }
  };

  const choosePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const logout = () => {
    logoutUser();
    onClose();
    window.location.reload();
  };

  return <div className="fixed inset-0 z-[100] flex min-h-full items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center sm:p-6">
    <div className="my-4 w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/20 bg-card/85 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:my-0">
      <div className="relative overflow-hidden bg-primary/10 px-6 py-7 sm:px-9"><div className="absolute -right-12 -top-20 h-48 w-48 rounded-full border-[28px] border-primary/10" /><div className="relative z-10 flex items-center justify-between"><div className="flex items-center gap-4"><Avatar user={{ ...user, avatar }} /><div><p className="text-sm text-muted-foreground">{t.result.account}</p><h2 className="text-2xl font-bold">{name}</h2><p className="text-sm text-muted-foreground">{email}</p></div></div><Button variant="ghost" size="icon" onClick={onClose} aria-label={t.common.close}><X className="h-4 w-4" /></Button></div></div>
      <div className="grid gap-6 p-6 sm:p-9 md:grid-cols-2">
        <form onSubmit={saveProfile} className="space-y-4"><div className="flex items-center gap-2 text-sm font-semibold"><User className="h-4 w-4 text-primary" />{t.result.editProfile}</div><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3"><Avatar user={{ ...user, avatar }} size="sm" /><span className="text-sm text-primary">{t.result.uploadPhoto}</span><input type="file" accept="image/*" className="hidden" onChange={choosePhoto} /></label><Input className="h-11 rounded-xl" value={name} onChange={(event) => setName(event.target.value)} placeholder={t.result.name} required /><Input className="h-11 rounded-xl" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t.result.email} required /><Button className="w-full rounded-xl" type="submit">{t.result.saveChanges}</Button></form>
        <form onSubmit={savePassword} className="space-y-4"><div className="flex items-center gap-2 text-sm font-semibold"><KeyRound className="h-4 w-4 text-primary" />{t.result.changePassword}</div><PasswordField value={currentPassword} onChange={setCurrentPassword} placeholder={t.result.currentPassword} visible={false} onToggle={() => undefined} /><PasswordField value={newPassword} onChange={setNewPassword} placeholder={t.result.newPassword} visible={false} onToggle={() => undefined} /><PasswordHint password={newPassword} /><Button className="w-full rounded-xl" type="submit" variant="outline">{t.result.changePassword}</Button><Button type="button" variant="ghost" onClick={logout} className="w-full gap-2 rounded-xl text-destructive hover:text-destructive"><LogOut className="h-4 w-4" />{t.result.logout}</Button></form>
      </div>
    </div>
  </div>;
}
