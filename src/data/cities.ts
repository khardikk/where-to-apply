// Cities (and remote) that get their own page at /in/<slug>, with the link builder preset to them.
export type CityPage = { slug: string; name: string; tag: 'India' | 'Remote'; blurb: string };

export const CITY_PAGES: CityPage[] = [
  { slug: 'bengaluru', name: 'Bengaluru', tag: 'India', blurb: 'India’s biggest tech hub: product companies, AI labs and most funded startups.' },
  { slug: 'hyderabad', name: 'Hyderabad', tag: 'India', blurb: 'Big-tech engineering centres and a fast-growing startup scene.' },
  { slug: 'pune', name: 'Pune', tag: 'India', blurb: 'SaaS, product engineering and global capability centres.' },
  { slug: 'mumbai', name: 'Mumbai', tag: 'India', blurb: 'Fintech, media and consumer startups.' },
  { slug: 'delhi-ncr', name: 'Delhi NCR', tag: 'India', blurb: 'Gurugram and Noida: consumer internet, fintech and SaaS.' },
  { slug: 'chennai', name: 'Chennai', tag: 'India', blurb: 'SaaS companies and large engineering centres.' },
  { slug: 'remote-india', name: 'Remote India', tag: 'Remote', blurb: 'Remote roles open to people living in India.' },
  { slug: 'remote', name: 'Remote', tag: 'Remote', blurb: 'Fully remote roles, anywhere.' },
];
