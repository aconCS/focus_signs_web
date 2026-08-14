"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { companyInfo } from "@/lib/content";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus-visible:border-indigo";

const labelClass =
  "text-xs font-semibold tracking-wide text-ink/65 uppercase";

export function QuoteForm() {
  const t = useTranslations("QuoteForm");
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = [
      `${t("bodyName")}: ${name}`,
      `${t("bodyEmail")}: ${email}`,
      `${t("bodyPhone")}: ${phone || "—"}`,
      `${t("bodyLocation")}: ${location || "—"}`,
      `${t("bodyBudget")}: ${budget || "—"}`,
      `${t("bodyTimeframe")}: ${timeframe || "—"}`,
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

  /* Optional label suffix, so the three new fields read as genuinely
     skippable rather than as more work before someone can get in touch. */
  const optional = (
    <span className="font-normal tracking-normal text-ink/65 normal-case">
      {t("optional")}
    </span>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {t("name")}
          </label>
          <input
            id="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          {t("phone")} {optional}
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass}
        />
      </div>

      {/* Context that makes a quote accurate. All optional — asking for it is
          worth it, requiring it would cost enquiries. */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="location" className={labelClass}>
            {t("location")} {optional}
          </label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("locationPlaceholder")}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="budget" className={labelClass}>
            {t("budget")} {optional}
          </label>
          <input
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={t("budgetPlaceholder")}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="timeframe" className={labelClass}>
            {t("timeframe")} {optional}
          </label>
          <input
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            placeholder={t("timeframePlaceholder")}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {t("message")}
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-indigo px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        {t("send")}
      </button>

      <p className="text-xs text-ink/65" aria-live="polite">
        {status === "sent" ? t("helperSent") : t("helperIdle")}
      </p>
    </form>
  );
}
