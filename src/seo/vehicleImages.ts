import x3 from "../assets/vehicles/bmwx3-gallery-4k.jpg.asset.json";
import x5 from "../assets/vehicles/bmwx5-gallery-4k.jpg.asset.json";
import sprinter from "../assets/vehicles/sprinter-gallery-4k.jpg.asset.json";
import cullinan from "../assets/vehicles/cullinan-gallery-4k.jpg.asset.json";
import phantom from "../assets/vehicles/phantom-refreshed-4k.jpg.asset.json";
import phantomCabin from "../assets/vehicles/phantom-gallery-4k.jpg.asset.json";
import autobiography from "../assets/vehicles/autobiography-refreshed-4k.jpg.asset.json";
import sport from "../assets/vehicles/rrsport-refreshed-4k.jpg.asset.json";
import maybach from "../assets/vehicles/maybach-refreshed-4k.jpg.asset.json";
import bmw7 from "../assets/vehicles/bmw7-refreshed-4k.jpg.asset.json";
import bmw5 from "../assets/vehicles/bmw5-refreshed-4k.jpg.asset.json";

// Only stable, published asset URLs belong in crawler-facing image discovery.
export const fleetSearchImages = [
  { name: "BMW X3", src: x3.url, selfDrive: true },
  { name: "BMW X5", src: x5.url, selfDrive: true },
  { name: "Mercedes Sprinter 16-seater", src: sprinter.url, selfDrive: false },
  { name: "Rolls-Royce Cullinan", src: cullinan.url, selfDrive: false },
  { name: "Rolls-Royce Phantom", src: phantom.url, selfDrive: false },
  { name: "Rolls-Royce Phantom", src: phantomCabin.url, selfDrive: false, detail: "Cream leather cabin with coach doors open" },
  { name: "Range Rover Autobiography", src: autobiography.url, selfDrive: true },
  { name: "Range Rover Sport", src: sport.url, selfDrive: true },
  { name: "Mercedes-Maybach S-Class", src: maybach.url, selfDrive: false },
  { name: "BMW 7 Series", src: bmw7.url, selfDrive: true },
  { name: "BMW 5 Series", src: bmw5.url, selfDrive: true },
];

export const vehiclePhotoAlt = (name: string, rental = false) =>
  `${name} — ${rental ? "self-drive car rental" : "chauffeur service"} in Cape Town | SVRM Group`;

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function fleetImagesForRoute(route: string) {
  if (route === "/chauffeur") return fleetSearchImages;
  if (route === "/rentals") return fleetSearchImages.filter(image => image.selfDrive);
  return [];
}

export function fleetImageHtml(route: string) {
  return fleetImagesForRoute(route).map(image => {
    const description = vehiclePhotoAlt(image.name, route === "/rentals");
    const alt = "detail" in image ? `${description} — ${image.detail}` : description;
    return `<figure><img src="${escapeXml(image.src)}" alt="${escapeXml(alt)}" width="3840" height="2560" loading="lazy" style="max-width:100%;height:auto" /><figcaption>${escapeXml(description)}</figcaption></figure>`;
  }).join("");
}

export function addFleetImagesToSitemap(xml: string) {
  const withNamespace = xml.includes('xmlns:image=') ? xml : xml.replace('<urlset ', '<urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ');
  return withNamespace.replace(/<url>([\s\S]*?)<\/url>/g, (entry, body: string) => {
    const loc = body.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const route = loc?.replace("https://svrm.group", "");
    const images = fleetImagesForRoute(route ?? "");
    if (!images.length) return entry;
    const tags = images.map(image => `<image:image><image:loc>${escapeXml(`https://svrm.group${image.src}`)}</image:loc></image:image>`).join("");
    return `<url>${body}${tags}</url>`;
  });
}