import { ReactNode } from "react";
import SmartImage from "@/components/svrm/SmartImage";

interface Props {
  id?: string;
  eyebrow: string;
  title: string;
  body: ReactNode;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  children?: ReactNode;
}

const SectionBlock = ({ id, eyebrow, title, body, image, imageAlt, reverse = false, children }: Props) => (
  <section id={id} className="py-20 md:py-28">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div className={`${reverse ? "lg:order-2" : ""} relative aspect-[4/3] overflow-hidden`}>
        <SmartImage
          src={image}
          alt={imageAlt}
          width={1536}
          height={1024}
          wrapperClassName="absolute inset-0 w-full h-full"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className={reverse ? "lg:order-1" : ""}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-serif text-3xl md:text-5xl mt-6 text-foreground leading-[1.1]">{title}</h2>
        <div className="gold-divider w-12 mt-8" />
        <div className="mt-8 text-muted-foreground leading-relaxed space-y-4">{body}</div>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </div>
  </section>
);

export default SectionBlock;
