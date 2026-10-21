import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import { Seo } from "@/components/Seo";
import { openCookieSettings } from "@/components/CookieConsent";

const Privacy = () => (
  <main className="bg-background text-foreground min-h-screen">
    <Seo title="Privacy Policy | SVRM Group" description="How SVRM Group handles enquiry details, cookies and Google Ads measurement on svrm.group." path="/privacy" />
    <Nav />
    <section className="max-w-3xl mx-auto px-6 pt-36 pb-24 space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
      <h1 className="font-serif text-4xl md:text-5xl text-foreground">Privacy policy</h1>
      <p>SVRM Group uses the details you send in an enquiry (name, contact details, dates and trip notes) only to reply to you and arrange your booking.</p>
      <h2 className="font-serif text-2xl text-foreground">Advertising measurement</h2>
      <p>We use Google Ads to measure which ads lead to WhatsApp enquiries and enquiry forms. Google receives information about your visit and that an enquiry happened, using cookies or similar technology. We do not send your name, email or phone number to Google.</p>
      <p>Visitors in the UK, the European Economic Area, Switzerland and Quebec are asked first, and measurement only runs after they accept. Everywhere else it runs by default, and you can turn it off at any time.</p>
      <p>Learn how Google uses this data: <a className="text-gold underline underline-offset-4" href="https://business.safety.google/privacy/" target="_blank" rel="noopener noreferrer">business.safety.google/privacy</a>.</p>
      <button type="button" onClick={openCookieSettings} className="text-gold underline underline-offset-4">Change cookie settings</button>
      <h2 className="font-serif text-2xl text-foreground">Contact</h2>
      <p>Questions about your data: concierge@svrm.group or WhatsApp +27 73 064 1481.</p>
    </section>
    <Footer />
  </main>
);

export default Privacy;
