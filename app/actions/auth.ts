"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { clearSession, setSession } from "@/lib/auth/session";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

function getSupabase() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey);
}

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const pseudo = String(formData.get("pseudo") ?? "").trim();

  if (!email || !password || !pseudo) {
    redirect("/register?error=missing_fields");
  }

  if (password.length < 8) {
    redirect("/register?error=password_too_short");
  }

  const supabase = getSupabase();

  const { data: user, error: userError } = await supabase
    .from("users")
    .insert({
      email,
      password_hash: await hashPassword(password),
      role: "blogger",
      is_active: true,
    })
    .select("id, email, role")
    .single();

  if (userError || !user) {
    redirect("/register?error=email_or_data_invalid");
  }

  const { error: blogError } = await supabase.from("blogs").insert({
    user_id: user.id,
    pseudo,
    is_visible: true,
  });

  if (blogError) {
    await supabase.from("users").delete().eq("id", user.id);
    redirect("/register?error=pseudo_unavailable");
  }

  await setSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect("/");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=missing_fields");
  }

  const supabase = getSupabase();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, role, password_hash, is_active")
    .eq("email", email)
    .maybeSingle();

  if (error || !user || !user.is_active) {
    redirect("/login?error=invalid_credentials");
  }

  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    redirect("/login?error=invalid_credentials");
  }

  await setSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
