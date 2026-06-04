import logoAsset from "@/assets/accessily-logo.png.asset.json";

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Accessily — All in One SEO Power"
      className={className}
      width={1500}
      height={500}
    />
  );
}
