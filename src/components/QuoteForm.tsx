"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { companyInfo } from "@/lib/content";

export function QuoteForm() {
  const t = useTranslations("QuoteForm");
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = [
      `${t("bodyName")}: ${name}`,
      `${t("bodyEmail")}: ${email}`,
      `${t("bodyPhone")}: ${phone || "—"}`,
      "",
      t("bodyMessage"),
      message || "—",
    ].join("\n");

    const mailto = `mailto:${companyInfo.email}?subject=${encodeURIComponent(
      t("subject", { name })
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setStatus("sent");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-xs font-semibold tracking-wide text-ink/65 uppercase">
            {t("name")}
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus-visible:border-indigo"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-semibold tracking-wide text-ink/65 uppercase">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus-visible:border-indigo"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="text-xs font-semibold tracking-wide text-ink/65 uppercase">
          {t("phone")}{" "}
          <span className="font-normal tracking-normal text-ink/65 normal-case">
            {t("phoneOptional")}
          </span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus-visible:border-indigo"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-xs font-semibold tracking-wide text-ink/65 uppercase">
          {t("message")}
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          className="mt-1.5 w-full resize-none rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus-visible:border-indigo"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-indigo px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-indigo"
      >
        {t("send")}
      </button>

      <p className="text-xs text-ink/65" aria-live="polite">
        {status === "sent" ? t("helperSent") : t("helperIdle")}
      </p>
    </form>
  );
}
