import { useQuery } from "@tanstack/react-query";
import logoAsset from "@/assets/accessily-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

async function fetchLogoUrl(): Promise<string | null> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "branding")
    .maybeSingle();
  const v = (data?.value ?? {}) as { logo_url?: string };
  return v.logo_url ?? null;
}

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  const { data: logoUrl } = useQuery({
    queryKey: ["site-branding-logo"],
    queryFn: fetchLogoUrl,
    staleTime: 5 * 60 * 1000,
  });
  return (
    <img
      src={logoUrl || logoAsset.url}
      alt="Accessily — All in One SEO Power"
      className={className}
    />
  );
}
