"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setStatus("No se pudo iniciar sesion. Revisar email, clave o permisos.");
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form className="panel form-stack" onSubmit={login}>
      <strong>Ingreso administrador</strong>
      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <input
        className="input"
        type="password"
        placeholder="Clave"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <button className="button" type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
      {status && <p className="form-status">{status}</p>}
    </form>
  );
}
