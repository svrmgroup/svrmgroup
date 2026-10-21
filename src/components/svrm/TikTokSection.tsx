import { TIKTOK_URL, SOCIAL_HANDLE } from "@/lib/whatsapp";

const videos = [
  { id: "7692917244375960854", title: "Cape Town, chauffeured" },
  { id: "7683999741947972886", title: "Behind the wheel at SVRM" },
  { id: "7684334622863346966", title: "Luxury, without compromise" },
];

const videoUrl = (id: string) => `https://www.tiktok.com/@svrmgroup/video/${id}`;

const TikTokSection = () => (
  <section id="tiktok" className="py-24 border-t border-border/40 scroll-mt-24">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <p className="eyebrow text-gold">TikTok · {SOCIAL_HANDLE}</p>
        <h2 className="font-serif text-3xl md:text-5xl mt-4">Follow us on TikTok</h2>
        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 text-xs uppercase tracking-[0.24em] text-gold border-b border-primary/40 pb-1 hover:border-primary"
        >
          Follow on TikTok →
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videos.map((v) => (
          <div key={v.id} className="group">
            <div className="aspect-[9/16] w-full max-w-[325px] mx-auto overflow-hidden border border-border/60 group-hover:border-primary transition-colors bg-surface-deep">
              <iframe
                src={`https://www.tiktok.com/player/v1/${v.id}?description=0&music_info=0&rel=0`}
                title={v.title}
                loading="lazy"
                allow="encrypted-media; fullscreen; picture-in-picture"
                className="w-full h-full"
              />
            </div>
            <a
              href={videoUrl(v.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center mt-4 font-serif text-xl text-foreground hover:text-gold transition-colors"
            >
              {v.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TikTokSection;
