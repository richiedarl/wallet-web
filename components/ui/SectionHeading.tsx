import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          <span className="eyebrow-dot" />
          {eyebrow}
        </span>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {link ? (
        <Link className="text-link" href={link.href}>
          {link.label}
          <ArrowRight aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
