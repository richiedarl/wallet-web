import {
  ArrowDownUp,
  ArrowUpRight,
  Coins,
  Gamepad2,
  Image,
  Layers3,
  Network,
  Sparkles,
} from "lucide-react";
import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ecosystemCategories } from "@/lib/crypto/mock-data";

const categoryIcons = {
  layers: Layers3,
  arrows: ArrowUpRight,
  swap: ArrowDownUp,
  sparkles: Sparkles,
  gamepad: Gamepad2,
  network: Network,
  coins: Coins,
  image: Image,
} as const;

export function EcosystemExplorer() {
  return (
    <section id="explore" className="section section-border">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Explore the ecosystem"
          title="Find your corner of crypto."
          description="From foundational networks to emerging ideas, explore the themes shaping the digital asset landscape."
          link={{ label: "Explore all themes", href: "#explore" }}
        />
        <div className="ecosystem-grid">
          {ecosystemCategories.map((category) => {
            const Icon = categoryIcons[category.icon as keyof typeof categoryIcons];
            const color = category.color;
            return (
              <Reveal key={category.name} className="reveal-card" delay={0.04}>
                <a
                  className="ecosystem-card"
                  href="#insights"
                  style={
                    {
                      "--ecosystem-light": color,
                      "--ecosystem-color": color,
                    } as CSSProperties
                  }
                >
                  <span className="ecosystem-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{category.name}</h3>
                  <p>{category.detail}</p>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
