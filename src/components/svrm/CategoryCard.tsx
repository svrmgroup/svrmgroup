import KenBurnsImage from "./KenBurnsImage";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  eyebrow: string;
  name: string;
  tagline: string;
  meta?: string;
  image: string;
  index: number;
  enquirySubject: string;
}

const CategoryCard = ({ eyebrow, name, tagline, meta, image, index, enquirySubject }: Props) => (
  <article className="group bg-surface-raised border border-border/40 flex flex-col">
    <KenBurnsImage
      src={image}
      alt={name}
      className="aspect-[16/10]"
      direction={(index % 4) as 0 | 1 | 2 | 3}
    />
    <div className="p-6 flex-1 flex flex-col">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="font-serif text-2xl mt-2 text-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground mt-2 flex-1">{tagline}</p>
      {meta && <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80 mt-3">{meta}</p>}
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">Pricing</p>
          <p className="font-serif text-xl text-gold">On request</p>
        </div>
        <a
          href={buildWhatsAppUrl(enquirySubject)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] uppercase tracking-[0.24em] px-4 py-3 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
        >
          Enquire
        </a>
      </div>
    </div>
  </article>
);

export default CategoryCard;
