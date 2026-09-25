"use client";

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

const USERS_KEY = "florascan-users";
const SESSION_KEY = "florascan-session";

export function getPasswordStrength(password: string): "weak" | "fair" | "strong" {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score >= 4 ? "strong" : score >= 2 ? "fair" : "weak";
}

export function validatePassword(password: string): void {
  if (password.length < 6 || getPasswordStrength(password) === "weak") {
    throw new Error("WEAK_PASSWORD");
  }
}

function readUsers(): LocalUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as LocalUser[];
  } catch {
    return [];
  }
}

export function getCurrentUser(): LocalUser | null {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? (JSON.parse(session) as LocalUser) : null;
  } catch {
    return null;
  }
}

export function registerUser(name: string, email: string, password: string): LocalUser {
  validatePassword(password);
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("EMAIL_EXISTS");
  }

  const user = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, password };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function loginUser(email: string, password: string): LocalUser {
  const user = readUsers().find(
    (item) => item.email === email.trim().toLowerCase() && item.password === password
  );
  if (!user) throw new Error("INVALID_CREDENTIALS");
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function updateUserProfile(userId: string, changes: Pick<LocalUser, "name" | "email" | "avatar">) {
  const users = readUsers();
  const normalizedEmail = changes.email.trim().toLowerCase();
  if (users.some((user) => user.id !== userId && user.email === normalizedEmail)) {
    throw new Error("EMAIL_EXISTS");
  }

  const current = users.find((user) => user.id === userId) ?? getCurrentUser();
  if (!current || current.id !== userId) throw new Error("USER_NOT_FOUND");
  const updated = { ...current, ...changes, name: changes.name.trim(), email: normalizedEmail };
  const nextUsers = users.some((user) => user.id === userId)
    ? users.map((user) => (user.id === userId ? updated : user))
    : [...users, updated];
  localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function updateUserPassword(userId: string, currentPassword: string, nextPassword: string) {
  validatePassword(nextPassword);
  const users = readUsers();
  const user = users.find((item) => item.id === userId);
  if (!user || user.password !== currentPassword) throw new Error("INVALID_PASSWORD");
  const updated = { ...user, password: nextPassword };
  localStorage.setItem(USERS_KEY, JSON.stringify(users.map((item) => item.id === userId ? updated : item)));
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}
