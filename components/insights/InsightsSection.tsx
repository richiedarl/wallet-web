import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { insights } from "@/lib/crypto/mock-data";

export function InsightsSection() {
  return (
    <section id="insights" className="section section-border">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Signals, not noise"
          title="Perspective for your next move."
          description="Ideas and context to help you make sense of a fast-moving market."
          link={{ label: "All insights", href: "#insights" }}
        />
        <div className="insights-grid">
          {insights.map((insight) => (
            <Reveal className="reveal-card" delay={0.05} key={insight.headline}>
              <article className="insight-card">
                <div className="insight-meta">
                  <span className="insight-category">{insight.category}</span>
                  <span>{insight.readingTime}</span>
                </div>
                <h3>{insight.headline}</h3>
                <p>{insight.description}</p>
                <Link className="text-link" href="#insights">
                  Read insight
                  <ArrowRight aria-hidden="true" />
                </Link>
                <span className="insight-meta" style={{ marginTop: 11 }}>
                  {insight.date}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
