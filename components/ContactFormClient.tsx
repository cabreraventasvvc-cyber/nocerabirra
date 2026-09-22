"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  reason: "",
  message: ""
};

export function ContactFormClient() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!form.name.trim() || !form.message.trim()) {
      setStatus("Completa nombre y mensaje para enviar la consulta.");
      return;
    }

    setSending(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("contacts").insert({
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      reason: form.reason.trim() || "Consulta",
      message: form.message.trim()
    });
    setSending(false);

    if (error) {
      setStatus(`No se pudo enviar la consulta: ${error.message}`);
      return;
    }

    setForm(initialForm);
    setStatus("Consulta enviada correctamente. Nos comunicaremos a la brevedad.");
  }

  return (
    <form className="panel" onSubmit={submitContact}>
      <div className="form-grid">
        <input
          className="input full"
          placeholder="Nombre"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Telefono"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          className="input full"
          placeholder="Motivo"
          value={form.reason}
          onChange={(event) => setForm({ ...form, reason: event.target.value })}
        />
        <textarea
          className="textarea full"
          placeholder="Mensaje"
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          required
        />
      </div>
      <div className="form-actions">
        <button className="button" type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Enviar consulta"}
        </button>
      </div>
      {status && <p className="form-status">{status}</p>}
    </form>
  );
}
