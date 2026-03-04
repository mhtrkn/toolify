import Image from "next/image";

function ToolHeader({
  title,
  icon,
  description,
  bgColor,
  borderColor,
}: {
  title: string;
  icon: string;
  description: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div className="flex items-start md:items-center gap-3">
      <div
        className={`flex min-w-12 min-h-12 h-12 w-12 items-center justify-center rounded-xl border bg-linear-to-br ${bgColor} ${borderColor} text-xl md:text-2xl`}
      >
        <Image
          src={`/icons/${icon}.png`}
          width={32}
          height={32}
          alt="PDF tools icon"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-1 text-slate-600">{description}</p>
      </div>
    </div>
  );
}

export default ToolHeader;
