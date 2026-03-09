import Image from "next/image";

// Renkleri daha modern ve canlı tonlarla güncelledim
const categoryStyles: Record<
  string,
  { color: string; icon: string; shadow: string }
> = {
  "PDF Tools": { color: "#ef4444", icon: "pdf", shadow: "shadow-red-500/20" },
  "Image Tools": {
    color: "#3b82f6",
    icon: "image",
    shadow: "shadow-blue-500/20",
  },
  "File Converter": {
    color: "#10b981",
    icon: "file",
    shadow: "shadow-green-500/20",
  },
  "OCR Tools": {
    color: "#f59e0b",
    icon: "ocr",
    shadow: "shadow-orange-500/20",
  },
  "Web Tools": {
    color: "#6366f1",
    icon: "web",
    shadow: "shadow-indigo-500/20",
  },
  "Social Media Tools": {
    color: "#f43f5e",
    icon: "social",
    shadow: "shadow-rose-500/20",
  },
  "SEO Tools": { color: "#14b8a6", icon: "web", shadow: "shadow-teal-500/20" },
  "Developer Tools": {
    color: "#8b5cf6",
    icon: "code",
    shadow: "shadow-violet-500/20",
  },
};

export default function BlogCover({
  category,
  size = "md",
}: {
  category: string;
  title: string;
  size?: "sm" | "md";
}) {
  const style = categoryStyles[category] || {
    color: "#64748b",
    icon: "file",
    shadow: "shadow-slate-500/20",
  };

  const containerHeight = size === "sm" ? "h-full" : "h-45";
  const iconBoxSize = size === "sm" ? "w-14 h-14" : "w-16 h-16";
  const iconImgSize = size === "sm" ? 32 : 44;

  return (
    <div
      className={`relative overflow-hidden rounded-t-2xl ${containerHeight} w-full flex flex-col items-center justify-center border border-white/10`}
      style={{
        backgroundColor: "#0f172a", // Koyu modern arka plan
        backgroundImage: `radial-gradient(circle at 50% 0%, ${style.color}50 0%, transparent 70%)`,
      }}
    >
      {/* Arka Plan Deseni (Grid) */}
      <div
        className="absolute inset-0 opacity-[0.5] mask-[radial-gradient(ellipse_at_center,white,transparent)]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='0-2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* İkon Konteynırı (Glassmorphism) */}
      <div
        className={`relative z-10 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xs ${iconBoxSize} ${style.shadow} shadow-2xl`}
      >
        <Image
          src={`/icons/${style.icon}.png`}
          alt={category}
          width={iconImgSize}
          height={iconImgSize}
          className="drop-shadow-lg"
        />
      </div>

      {/* Dekoratif Işık Efekti */}
      <div
        className="absolute -bottom-10 -left-10 w-32 h-32 blur-[20px] rounded-full"
        style={{ backgroundColor: style.color + "22" }}
      />
    </div>
  );
}
