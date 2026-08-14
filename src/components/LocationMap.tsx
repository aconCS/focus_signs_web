import { companyInfo } from "@/lib/content";

export function LocationMap({ className = "" }: { className?: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    companyInfo.address
  )}&output=embed`;

  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <iframe
        title={`${companyInfo.name} location`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[320px] w-full"
      />
    </div>
  );
}
