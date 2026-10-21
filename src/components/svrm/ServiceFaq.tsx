import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FaqAnswer from "@/components/svrm/FaqAnswer";
import type { FaqAnswerData } from "@/lib/faq";

export default function ServiceFaq({ items }: { items: FaqAnswerData[] }) {
  return <Accordion type="multiple" className="w-full">
    {items.map((item, index) => <AccordionItem key={item.q} value={`faq-${index}`} className="border-border/40">
      <AccordionTrigger className="text-left font-serif text-lg md:text-xl text-foreground hover:text-primary hover:no-underline py-5">{item.q}</AccordionTrigger>
      <AccordionContent forceMount className="text-muted-foreground leading-relaxed text-base whitespace-pre-wrap" hidden={undefined}>
        <FaqAnswer item={item} />
      </AccordionContent>
    </AccordionItem>)}
  </Accordion>;
}