import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FAQ_WHATSAPP_NUMBER, FAQ_WHATSAPP_URL, type FaqAnswerData } from "@/lib/faq";

export default function FaqAnswer({ item, renderText = (text) => text }: {
  item: FaqAnswerData;
  renderText?: (text: string) => ReactNode;
}) {
  const labels = [FAQ_WHATSAPP_NUMBER, ...(item.link ? [item.link.label] : [])];
  const pattern = new RegExp(`(${labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return <>{item.a.split(pattern).map((part, index) => {
    if (part === FAQ_WHATSAPP_NUMBER) return (
      <a key={index} href={FAQ_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="notranslate inline-block font-medium text-primary underline underline-offset-4" translate="no" dir="ltr">{FAQ_WHATSAPP_NUMBER}</a>
    );
    if (item.link && part === item.link.label) return <Link key={index} to={item.link.to} className="text-primary underline underline-offset-4">{renderText(part)}</Link>;
    return <Fragment key={index}>{renderText(part)}</Fragment>;
  })}</>;
}