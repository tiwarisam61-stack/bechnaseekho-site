import ModernMinimal from "@/templates/ModernMinimal";
import Editorial from "@/templates/Editorial";
import BoldCreative from "@/templates/BoldCreative";
import Timeline from "@/templates/Timeline";
import TechCompact from "@/templates/TechCompact";
import ClassicCorporate from "@/templates/ClassicCorporate";
import StartupVibe from "@/templates/StartupVibe";
import Academic from "@/templates/Academic";

export const TEMPLATE_COMPONENTS = {
  "modern-minimal": ModernMinimal,
  "editorial": Editorial,
  "bold-creative": BoldCreative,
  "timeline": Timeline,
  "tech-compact": TechCompact,
  "classic-corporate": ClassicCorporate,
  "startup-vibe": StartupVibe,
  "academic": Academic,
};

export const renderTemplate = (id, data) => {
  const Comp = TEMPLATE_COMPONENTS[id] || ModernMinimal;
  return <Comp data={data} />;
};

