// Every link here was opened and checked on CHECKED_ON (X accounts via X's public embed endpoint).
// Run `npm run check-links` to re-check. Keep notes to one line: why this source is worth your time.

export const CHECKED_ON = '2026-10-16';

export type Tag = 'India' | 'Remote' | 'AI' | 'Startups' | 'FDE' | 'Referrals' | 'Events' | 'Prep' | 'Salary';

export type CategoryId =
  | 'boards'
  | 'startups'
  | 'vc'
  | 'ai'
  | 'fde'
  | 'companies'
  | 'remote'
  | 'hiring'
  | 'people'
  | 'orgs'
  | 'communities'
  | 'tools';

export const CATEGORIES: { id: CategoryId; title: string; short: string; blurb: string }[] = [
  { id: 'boards', short: 'India boards', title: 'Job boards in India', blurb: 'Where most Indian tech roles are posted first.' },
  { id: 'startups', short: 'Startups', title: 'Startup jobs', blurb: 'Smaller teams, faster loops, founders read applications.' },
  { id: 'vc', short: 'VC boards', title: 'VC portfolio job boards', blurb: 'One search across hundreds of funded startups. Underused.' },
  { id: 'ai', short: 'AI boards', title: 'AI and LLM job boards', blurb: 'Boards that only list AI, agent and LLM roles.' },
  { id: 'fde', short: 'FDE', title: 'Forward deployed engineer', blurb: 'Companies known for FDE roles. Also search Applied AI Engineer and AI Solutions Engineer.' },
  { id: 'companies', short: 'Companies', title: 'AI and product companies hiring in India', blurb: 'Go straight to the careers page. Filter by Bengaluru or India.' },
  { id: 'remote', short: 'Remote', title: 'Remote, India-friendly', blurb: 'Remote boards and platforms that place engineers from India.' },
  { id: 'hiring', short: 'Hiring on X', title: 'Hiring on X: founders and team leads', blurb: 'People who hire for their own teams. Send a short DM with proof of work, not a resume dump.' },
  { id: 'people', short: 'People on X', title: 'People to follow on X', blurb: 'Founders, builders and educators worth following and learning from.' },
  { id: 'orgs', short: 'Accounts on X', title: 'Accounts to follow on X', blurb: 'Companies, funds and communities that post roles and events.' },
  { id: 'communities', short: 'Communities', title: 'Communities and events', blurb: 'Where referrals actually come from. Show up, ship, talk to people.' },
  { id: 'tools', short: 'Apps and prep', title: 'Apps and prep', blurb: 'Track applications, check pay, prepare for interviews.' },
];

export type Source = {
  name: string;
  url: string;
  category: CategoryId;
  note: string;
  tags: Tag[];
  /** X handle without @, for people and accounts. */
  x?: string;
  /** Website whose icon stands in when an X avatar can't be fetched. */
  site?: string;
  /** For people in "Hiring on X": the company they hire for. */
  company?: string;
  /** Date it was added (YYYY-MM-DD). Shows a "New" badge for NEW_FOR_DAYS days. Leave out for the launch list. */
  added?: string;
};

export const NEW_FOR_DAYS = 21;

const x = (handle: string) => `https://x.com/${handle}`;

export const SOURCES: Source[] = [
  // Job boards in India
  { category: 'boards', name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/', tags: ['India', 'Remote'], note: 'The most volume. Filter "Past 24 hours" and apply early.' },
  { category: 'boards', name: 'Naukri', url: 'https://www.naukri.com', tags: ['India'], note: "India's biggest board. Recruiters search profiles here, so keep yours fresh." },
  { category: 'boards', name: 'Instahyre', url: 'https://www.instahyre.com', tags: ['India'], note: 'Companies reach out to you. Best with 2+ years of experience.' },
  { category: 'boards', name: 'Cutshort', url: 'https://cutshort.io', tags: ['India', 'Startups'], note: 'Tech-only board with AI matching, heavy on startups.' },
  { category: 'boards', name: 'Hirist', url: 'https://www.hirist.tech', tags: ['India'], note: 'Developer-focused IT jobs board.' },
  { category: 'boards', name: 'foundit', url: 'https://www.foundit.in', tags: ['India'], note: 'Formerly Monster India. Large volume across companies.' },
  { category: 'boards', name: 'Indeed India', url: 'https://in.indeed.com', tags: ['India'], note: 'Aggregates postings from company sites and boards.' },
  { category: 'boards', name: 'Glassdoor India', url: 'https://www.glassdoor.co.in/Job/index.htm', tags: ['India', 'Salary'], note: 'Jobs plus reviews and real interview questions per company.' },
  { category: 'boards', name: 'Peerlist Jobs', url: 'https://peerlist.io/jobs', tags: ['India', 'Startups'], note: 'Profile-first network for builders. Your projects do the talking.' },
  { category: 'boards', name: 'Levels.fyi Jobs', url: 'https://www.levels.fyi/jobs', tags: ['India', 'Salary'], note: 'Roles with pay ranges next to them.' },
  { category: 'boards', name: 'Hasjob', url: 'https://hasjob.co', tags: ['India'], note: "Hasgeek's community job board. Smaller, posted by teams directly." },

  // Startup jobs
  { category: 'startups', name: 'Wellfound', url: 'https://wellfound.com/jobs', tags: ['Startups', 'Remote', 'India'], note: 'Salary and equity shown up front. Applications go to the team.' },
  { category: 'startups', name: 'YC Work at a Startup', site: 'ycombinator.com', url: 'https://www.workatastartup.com', tags: ['Startups', 'Remote'], note: 'One profile, every YC startup. Founders message you.' },
  { category: 'startups', name: 'YC Jobs', url: 'https://www.ycombinator.com/jobs', tags: ['Startups', 'Remote'], note: 'Curated roles at YC companies, with remote filters.' },
  { category: 'startups', name: 'YC companies in India', url: 'https://www.ycombinator.com/companies?regions=India', tags: ['Startups', 'India'], note: "Every YC company in India. Find the founders, then DM them." },
  { category: 'startups', name: "HN: Who is hiring?", url: 'https://news.ycombinator.com/submitted?id=whoishiring', tags: ['Startups', 'Remote'], note: 'Monthly thread on the first weekday. Founders post directly.' },
  { category: 'startups', name: 'HNHIRING', site: 'news.ycombinator.com', url: 'https://hnhiring.com', tags: ['Startups', 'Remote'], note: 'Searchable archive of every Who is hiring post.' },
  { category: 'startups', name: 'TopStartups', url: 'https://topstartups.io', tags: ['Startups'], note: 'Funded startups (YC, Sequoia, a16z, Accel) with open roles.' },
  { category: 'startups', name: 'startup.jobs', url: 'https://startup.jobs', tags: ['Startups', 'Remote'], note: 'Large aggregator of startup roles worldwide.' },
  { category: 'startups', name: 'Welcome to the Jungle', url: 'https://www.welcometothejungle.com/en/jobs', tags: ['Startups', 'Remote'], note: 'Curated startup jobs. Otta merged into it.' },

  // VC portfolio job boards
  { category: 'vc', name: 'Peak XV', url: 'https://careers.peakxv.com', tags: ['India', 'Startups'], note: 'Jobs across Peak XV companies like Razorpay, CRED and Groww.' },
  { category: 'vc', name: 'Accel', url: 'https://jobs.accel.com', tags: ['India', 'Startups'], note: 'Accel portfolio, including Freshworks, Swiggy and BrowserStack.' },
  { category: 'vc', name: 'Lightspeed', url: 'https://jobs.lsvp.com', tags: ['India', 'Startups'], note: 'Lightspeed portfolio, global and India.' },
  { category: 'vc', name: 'a16z', url: 'https://jobs.a16z.com', tags: ['Startups', 'AI'], note: 'Andreessen Horowitz portfolio, strong on AI and infra.' },
  { category: 'vc', name: 'Sequoia', url: 'https://jobs.sequoiacap.com', tags: ['Startups', 'AI'], note: "Sequoia's global portfolio." },
  { category: 'vc', name: 'General Catalyst', url: 'https://jobs.generalcatalyst.com', tags: ['Startups'], note: 'General Catalyst portfolio companies.' },
  { category: 'vc', name: 'Kleiner Perkins', url: 'https://jobs.kleinerperkins.com', tags: ['Startups'], note: 'Kleiner Perkins portfolio companies.' },
  { category: 'vc', name: 'Bessemer', url: 'https://jobs.bvp.com', tags: ['Startups'], note: 'Bessemer portfolio, lots of B2B SaaS.' },
  { category: 'vc', name: 'Index Ventures', url: 'https://www.indexventures.com/startup-jobs', tags: ['Startups', 'Remote'], note: 'Thousands of roles across the Index portfolio.' },

  // AI and LLM job boards
  { category: 'ai', name: 'Inference Jobs', url: 'https://www.inferencejobs.com', tags: ['AI', 'FDE', 'India'], note: 'Roles at AI companies. Filter by India and by FDE.' },
  { category: 'ai', name: 'Agentic Engineering Jobs', url: 'https://agentic-engineering-jobs.com', tags: ['AI', 'Remote'], note: 'Only roles building agents, RAG and LLM apps.' },
  { category: 'ai', name: 'Peerlist: LLM roles', url: 'https://peerlist.io/jobs?skills=LLM', tags: ['AI', 'India'], note: 'Peerlist jobs filtered to LLM skills.' },
  { category: 'ai', name: 'HNHIRING: AI engineer', site: 'news.ycombinator.com', url: 'https://hnhiring.com/search?q=AI+engineer', tags: ['AI', 'Startups', 'Remote'], note: "This month's Who is hiring, searched for AI engineer." },

  // Forward deployed engineer
  { category: 'fde', name: 'Palantir', url: 'https://www.palantir.com/careers/', tags: ['FDE'], note: 'Where the forward deployed engineer title started.' },
  { category: 'fde', name: 'OpenAI', url: 'https://openai.com/careers', tags: ['FDE', 'AI'], note: 'Has a forward deployed engineering team. Filter by location.' },
  { category: 'fde', name: 'Anthropic', url: 'https://www.anthropic.com/careers', tags: ['FDE', 'AI'], note: 'Applied AI and customer-facing engineering roles.' },
  { category: 'fde', name: 'Scale AI', url: 'https://scale.com/careers', tags: ['FDE', 'AI'], note: 'Forward deployed roles on GenAI projects.' },
  { category: 'fde', name: 'Salesforce', url: 'https://www.salesforce.com/company/careers/', tags: ['FDE', 'AI', 'India'], note: 'Hiring FDEs for Agentforce. Large India presence.' },
  { category: 'fde', name: 'Google Careers', url: 'https://www.google.com/about/careers/applications/', tags: ['FDE', 'AI', 'India'], note: 'Search "forward deployed" for Google Cloud GenAI roles in Bengaluru.' },
  { category: 'fde', name: 'Sierra', url: 'https://sierra.ai/careers', tags: ['FDE', 'AI'], note: 'AI customer-service agents built with enterprises. Customer-facing engineering.' },
  { category: 'fde', name: 'Decagon', url: 'https://decagon.ai/careers', tags: ['FDE', 'AI'], note: 'AI support agents. Engineering that sits close to customers.' },
  { category: 'fde', name: 'Inference Jobs: FDE in India', url: 'https://www.inferencejobs.com/jobs/locations/india/forward-deployed-engineer', tags: ['FDE', 'AI', 'India'], note: 'Open FDE roles tagged to India.' },

  // AI and product companies hiring in India
  { category: 'companies', name: 'Sarvam AI', url: 'https://www.sarvam.ai/careers', tags: ['AI', 'India'], note: 'Bengaluru lab building Indian-language LLMs and voice models.' },
  { category: 'companies', name: 'Google DeepMind', url: 'https://deepmind.google/careers/', tags: ['AI', 'India'], note: 'Research and applied roles. Filter for Bengaluru.' },
  { category: 'companies', name: 'Microsoft IDC', url: 'https://www.microsoft.com/en-in/msidc/', tags: ['AI', 'India'], note: "Microsoft's India Development Center: Hyderabad, Bengaluru, Noida." },
  { category: 'companies', name: 'Perplexity', url: 'https://www.perplexity.ai/hub/careers', tags: ['AI'], note: 'AI answer engine. Small teams, high bar.' },
  { category: 'companies', name: 'Databricks', url: 'https://www.databricks.com/company/careers', tags: ['AI', 'India'], note: 'Data and AI platform with a Bengaluru engineering team.' },
  { category: 'companies', name: 'Glean', url: 'https://www.glean.com/careers', tags: ['AI'], note: 'Enterprise AI search and agents. Check for Bengaluru roles.' },
  { category: 'companies', name: 'Atlan', url: 'https://atlan.com/careers/', tags: ['AI', 'India', 'Startups'], note: 'Data and AI governance platform, founded in India.' },
  { category: 'companies', name: 'Composio', url: 'https://jobs.ashbyhq.com/composio', tags: ['AI', 'Startups'], note: 'Tools and integrations layer for AI agents.' },
  { category: 'companies', name: 'Lossfunk', url: 'https://lossfunk.com', tags: ['AI', 'India'], note: "Paras Chopra's AI research lab." },
  { category: 'companies', name: 'Uniphore', url: 'https://www.uniphore.com/careers/', tags: ['AI', 'India'], note: 'Enterprise conversational and agentic AI, founded in Chennai.' },
  { category: 'companies', name: 'Gupshup', url: 'https://www.gupshup.ai/careers', tags: ['AI', 'India'], note: 'Conversational messaging and AI agents for businesses.' },
  { category: 'companies', name: 'Observe.AI', url: 'https://www.observe.ai/careers', tags: ['AI'], note: 'AI for contact centers.' },
  { category: 'companies', name: 'Ema', url: 'https://www.ema.ai/careers', tags: ['AI', 'Startups'], note: 'Agentic AI employees for enterprises.' },
  { category: 'companies', name: 'Lyzr', url: 'https://careers.lyzr.ai/', tags: ['AI', 'Startups'], note: 'Enterprise agent framework and platform.' },
  { category: 'companies', name: 'Sprinklr', url: 'https://www.sprinklr.com/careers/', tags: ['AI', 'India'], note: 'Customer-experience platform with large India engineering teams.' },
  { category: 'companies', name: 'Razorpay', url: 'https://razorpay.com/careers/', tags: ['India'], note: 'Payments. Strong engineering culture in Bengaluru.' },
  { category: 'companies', name: 'CRED', url: 'https://careers.cred.club/', tags: ['India'], note: 'Consumer fintech known for product and design craft.' },
  { category: 'companies', name: 'Zerodha', url: 'https://careers.zerodha.com/', tags: ['India'], note: 'Small, FOSS-friendly tech team behind the stockbroker.' },
  { category: 'companies', name: 'Postman', url: 'https://www.postman.com/company/careers/', tags: ['India', 'AI'], note: 'API platform founded in Bengaluru.' },
  { category: 'companies', name: 'BrowserStack', url: 'https://www.browserstack.com/careers', tags: ['India'], note: 'Testing infrastructure, founded in Mumbai.' },
  { category: 'companies', name: 'Freshworks', url: 'https://www.freshworks.com/company/careers/', tags: ['India', 'AI'], note: 'SaaS founded in Chennai, building AI agents (Freddy).' },
  { category: 'companies', name: 'Rippling', url: 'https://www.rippling.com/careers', tags: ['India'], note: 'HR and IT platform with a Bengaluru engineering office.' },

  // Remote, India-friendly
  { category: 'remote', name: 'Uplers', url: 'https://www.uplers.com', tags: ['Remote', 'India'], note: 'Matches engineers in India with remote roles at global companies.' },
  { category: 'remote', name: 'Turing', url: 'https://www.turing.com/jobs', tags: ['Remote'], note: 'Remote roles at US companies after a vetting test.' },
  { category: 'remote', name: 'Arc', url: 'https://arc.dev', tags: ['Remote'], note: 'Vetted remote and freelance developer roles.' },
  { category: 'remote', name: 'Crossover', url: 'https://www.crossover.com', tags: ['Remote'], note: 'Full-time remote roles at fixed rates. Tough skills tests.' },
  { category: 'remote', name: 'RemoteStack', url: 'https://remotestack.in', tags: ['Remote', 'India'], note: "Remote roles that link straight to the company's own ATS." },
  { category: 'remote', name: 'Himalayas', url: 'https://himalayas.app', tags: ['Remote'], note: 'Remote board with filters for time zone and country.' },
  { category: 'remote', name: 'We Work Remotely', url: 'https://weworkremotely.com', tags: ['Remote'], note: 'One of the oldest remote boards.' },
  { category: 'remote', name: 'Remote OK', url: 'https://remoteok.com', tags: ['Remote'], note: 'High-volume remote board with salary filters.' },
  { category: 'remote', name: 'Remotive', url: 'https://remotive.com', tags: ['Remote'], note: 'Hand-checked remote tech roles.' },
  { category: 'remote', name: 'Remote Rocketship', url: 'https://www.remoterocketship.com', tags: ['Remote'], note: 'Remote roles pulled from company sites, many not on LinkedIn.' },
  { category: 'remote', name: 'Working Nomads', url: 'https://www.workingnomads.com/jobs', tags: ['Remote'], note: 'Curated remote jobs by category.' },
  { category: 'remote', name: 'JustRemote', url: 'https://justremote.co', tags: ['Remote'], note: 'Remote jobs, including fully location-independent ones.' },

  // Hiring on X: people who hire for their own teams. `company` is required.
  { category: 'hiring', name: 'Aravind Srinivas', company: 'Perplexity', x: 'AravSrinivas', url: x('AravSrinivas'), tags: ['AI', 'Startups'], note: 'Co-founder and CEO of Perplexity.' },
  { category: 'hiring', name: 'Paras Chopra', company: 'Lossfunk', x: 'paraschopra', url: x('paraschopra'), tags: ['AI', 'India'], note: 'Founder of Wingify; runs the Lossfunk AI lab.' },
  { category: 'hiring', name: 'Kailash Nadh', company: 'Zerodha', x: 'nadh', url: x('nadh'), tags: ['India'], note: 'CTO of Zerodha; runs its small in-house tech team.' },
  { category: 'hiring', name: 'Nithin Kamath', company: 'Zerodha', x: 'Nithin0dha', url: x('Nithin0dha'), tags: ['India'], note: 'Founder and CEO of Zerodha.' },
  { category: 'hiring', name: 'Kunal Shah', company: 'CRED', x: 'kunalb11', url: x('kunalb11'), tags: ['India', 'Startups'], note: 'Founder and CEO of CRED.' },
  { category: 'hiring', name: 'Harshil Mathur', company: 'Razorpay', x: 'harshilmathur', site: 'razorpay.com', url: x('harshilmathur'), tags: ['India'], note: 'Co-founder and CEO of Razorpay.', added: '2026-10-16' },
  { category: 'hiring', name: 'Bhavish Aggarwal', company: 'Krutrim', x: 'bhash', site: 'olakrutrim.com', url: x('bhash'), tags: ['AI', 'India'], note: 'Founder of Ola and Krutrim, which builds Indian AI models.', added: '2026-10-16' },
  { category: 'hiring', name: 'Prukalpa Sankar', company: 'Atlan', x: 'prukalpa', site: 'atlan.com', url: x('prukalpa'), tags: ['AI', 'India', 'Startups'], note: 'Co-founder of Atlan, the data and AI governance platform.', added: '2026-10-16' },
  { category: 'hiring', name: 'Guillermo Rauch', company: 'Vercel', x: 'rauchg', site: 'vercel.com', url: x('rauchg'), tags: ['AI', 'Remote'], note: 'Founder and CEO of Vercel.', added: '2026-10-16' },
  { category: 'hiring', name: 'Amjad Masad', company: 'Replit', x: 'amasad', site: 'replit.com', url: x('amasad'), tags: ['AI', 'Startups'], note: 'Founder and CEO of Replit.', added: '2026-10-16' },
  { category: 'hiring', name: 'Harrison Chase', company: 'LangChain', x: 'hwchase17', site: 'langchain.com', url: x('hwchase17'), tags: ['AI', 'Startups'], note: 'Co-founder and CEO of LangChain.', added: '2026-10-16' },
  { category: 'hiring', name: 'Jerry Liu', company: 'LlamaIndex', x: 'jerryjliu0', site: 'llamaindex.ai', url: x('jerryjliu0'), tags: ['AI', 'Startups'], note: 'Co-founder and CEO of LlamaIndex.', added: '2026-10-16' },
  { category: 'hiring', name: 'Michael Truell', company: 'Cursor', x: 'mntruell', site: 'cursor.com', url: x('mntruell'), tags: ['AI', 'Startups'], note: 'Co-founder and CEO of Cursor (Anysphere).', added: '2026-10-16' },
  { category: 'hiring', name: 'Aman Sanger', company: 'Cursor', x: 'amanrsanger', site: 'cursor.com', url: x('amanrsanger'), tags: ['AI', 'Startups'], note: 'Co-founder of Cursor (Anysphere).', added: '2026-10-16' },

  // People to follow on X
  { category: 'people', name: 'Harkirat Singh', x: 'kirat_tw', url: x('kirat_tw'), tags: ['India'], note: 'Runs 100xDevs, a large Indian developer community.' },
  { category: 'people', name: 'Varun Mayya', x: 'VarunMayya', url: x('VarunMayya'), tags: ['AI', 'India'], note: 'Founder building with AI from Bengaluru.' },
  { category: 'people', name: 'Deedy Das', x: 'deedydas', url: x('deedydas'), tags: ['AI', 'India'], note: 'Investor at Menlo Ventures; posts on AI and India tech.' },
  { category: 'people', name: 'Tanay Pratap', x: 'tanaypratap', url: x('tanaypratap'), tags: ['India'], note: 'Mentor and educator for Indian developers.' },
  { category: 'people', name: 'Arpit Bhayani', x: 'arpit_bhayani', url: x('arpit_bhayani'), tags: ['India', 'Prep'], note: 'Engineering educator; systems deep dives.' },
  { category: 'people', name: 'Gaurav Sen', x: 'gkcs_', url: x('gkcs_'), tags: ['India', 'Prep'], note: 'System design educator, InterviewReady.' },
  { category: 'people', name: 'Striver', x: 'striver_79', url: x('striver_79'), tags: ['India', 'Prep'], note: 'DSA prep at takeUforward.' },
  { category: 'people', name: 'Kunal Kushwaha', x: 'kunalstwt', url: x('kunalstwt'), tags: ['India'], note: 'Open source and DevRel community builder.' },
  { category: 'people', name: 'swyx', x: 'swyx', url: x('swyx'), tags: ['AI'], note: 'Popularized "AI engineer"; runs Latent Space.' },
  { category: 'people', name: 'Hamel Husain', x: 'HamelHusain', url: x('HamelHusain'), tags: ['AI'], note: 'Teaches LLM evals. Read him before your next AI interview.' },
  { category: 'people', name: 'Eugene Yan', x: 'eugeneyan', url: x('eugeneyan'), tags: ['AI'], note: 'Writes on LLM evals and production ML.' },
  { category: 'people', name: 'Jason Liu', x: 'jxnlco', url: x('jxnlco'), tags: ['AI'], note: 'Creator of Instructor; RAG and AI consulting.' },
  { category: 'people', name: 'Simon Willison', x: 'simonw', url: x('simonw'), tags: ['AI'], note: 'Daily, hands-on notes on LLM tools.' },
  { category: 'people', name: 'Gergely Orosz', x: 'GergelyOrosz', url: x('GergelyOrosz'), tags: ['Salary'], note: 'The Pragmatic Engineer; tech job-market data.' },
  { category: 'people', name: 'Garry Tan', x: 'garrytan', url: x('garrytan'), tags: ['Startups'], note: 'President and CEO of Y Combinator.' },
  { category: 'people', name: 'Pieter Levels', x: 'levelsio', url: x('levelsio'), tags: ['Startups'], note: 'Proof that building in public gets you noticed.' },

  // Accounts to follow on X
  { category: 'orgs', name: 'Sarvam AI', x: 'SarvamAI', site: 'sarvam.ai', url: x('SarvamAI'), tags: ['AI', 'India'], note: 'Indian LLM lab. Launches and research.' },
  { category: 'orgs', name: 'Y Combinator', x: 'ycombinator', site: 'ycombinator.com', url: x('ycombinator'), tags: ['Startups'], note: 'Batch launches: new startups that will be hiring soon.' },
  { category: 'orgs', name: 'Peak XV Partners', x: 'peakxvpartners', site: 'peakxv.com', url: x('peakxvpartners'), tags: ['India', 'Startups'], note: 'Portfolio news from one of India’s biggest funds.' },
  { category: 'orgs', name: 'a16z', x: 'a16z', site: 'a16z.com', url: x('a16z'), tags: ['Startups', 'AI'], note: 'Andreessen Horowitz.' },
  { category: 'orgs', name: 'Sequoia', x: 'sequoia', site: 'sequoiacap.com', url: x('sequoia'), tags: ['Startups', 'AI'], note: 'Sequoia Capital.' },
  { category: 'orgs', name: 'Hugging Face', x: 'huggingface', site: 'huggingface.co', url: x('huggingface'), tags: ['AI'], note: 'Open models and the community around them.' },
  { category: 'orgs', name: 'Latent Space', x: 'latentspacepod', site: 'latent.space', url: x('latentspacepod'), tags: ['AI'], note: 'The AI engineer podcast.' },
  { category: 'orgs', name: 'Hasgeek', x: 'hasgeek', site: 'hasgeek.com', url: x('hasgeek'), tags: ['India', 'Events'], note: 'Bengaluru tech conferences and meetups.' },
  { category: 'orgs', name: 'FOSS United', x: 'fossunited', site: 'fossunited.org', url: x('fossunited'), tags: ['India', 'Events'], note: 'Open source events across India.' },
  { category: 'orgs', name: 'Devfolio', x: 'devfolio', site: 'devfolio.co', url: x('devfolio'), tags: ['India', 'Events'], note: 'Hackathon announcements.' },
  { category: 'orgs', name: 'AI Tinkerers', x: 'aitinkerers', site: 'aitinkerers.org', url: x('aitinkerers'), tags: ['AI', 'Events'], note: 'Builder meetups, including Bengaluru.' },
  { category: 'orgs', name: 'lablab.ai', x: 'lablabai', site: 'lablab.ai', url: x('lablabai'), tags: ['AI', 'Events'], note: 'Online AI hackathons.' },
  { category: 'orgs', name: 'Real Dev Squad', x: 'realdevsquad', site: 'realdevsquad.com', url: x('realdevsquad'), tags: ['India'], note: 'Indian dev community that ships real projects.' },
  { category: 'orgs', name: 'Wellfound', x: 'wellfound', site: 'wellfound.com', url: x('wellfound'), tags: ['Startups'], note: 'Startup job board.' },
  { category: 'orgs', name: 'Peerlist', x: 'peerlist', site: 'peerlist.io', url: x('peerlist'), tags: ['India'], note: 'Builder profiles and jobs.' },
  { category: 'orgs', name: 'Cutshort', x: 'cutshort', site: 'cutshort.io', url: x('cutshort'), tags: ['India'], note: 'Tech jobs in India.' },
  { category: 'orgs', name: 'MLOps Community', x: 'mlopscommunity', site: 'mlops.community', url: x('mlopscommunity'), tags: ['AI', 'Events'], note: 'ML and LLMs in production.' },

  // Communities and events
  { category: 'communities', name: 'AI Tinkerers Bengaluru', url: 'https://bangalore.aitinkerers.org/', tags: ['AI', 'India', 'Events'], note: 'Builders-only AI meetups. Bring a demo, not slides.' },
  { category: 'communities', name: 'Luma: Bengaluru', url: 'https://luma.com/bengaluru', tags: ['India', 'Events'], note: 'Calendar of tech and AI events in the city.' },
  { category: 'communities', name: 'Hasgeek', url: 'https://hasgeek.com', tags: ['India', 'Events'], note: 'Rootconf, The Fifth Elephant and other Bengaluru conferences.' },
  { category: 'communities', name: 'The Fifth Elephant', url: 'https://hasgeek.com/fifthelephant', tags: ['India', 'AI', 'Events'], note: "Hasgeek's data and AI conference." },
  { category: 'communities', name: 'GDG Bangalore', url: 'https://gdg.community.dev/gdg-bangalore/', tags: ['India', 'Events'], note: 'Google Developer Group meetups and DevFest.' },
  { category: 'communities', name: 'PyCon India', url: 'https://in.pycon.org', tags: ['India', 'Events'], note: 'Annual Python conference. Great for meeting AI teams.' },
  { category: 'communities', name: 'FOSS United', url: 'https://fossunited.org', tags: ['India', 'Events'], note: 'IndiaFOSS and open source city meetups.' },
  { category: 'communities', name: 'Devfolio', url: 'https://devfolio.co', tags: ['India', 'Events'], note: 'Hackathons across India, from weekend events to ETHIndia.' },
  { category: 'communities', name: 'lablab.ai', url: 'https://lablab.ai', tags: ['AI', 'Remote', 'Events'], note: 'Online AI hackathons, often run with model labs.' },
  { category: 'communities', name: 'Real Dev Squad', url: 'https://www.realdevsquad.com', tags: ['India'], note: 'Contribute to real products with mentors. Good for juniors.' },
  { category: 'communities', name: 'MLOps Community', url: 'https://mlops.community', tags: ['AI', 'Remote'], note: 'Slack and meetups on running ML and LLMs in production.' },
  { category: 'communities', name: 'Hugging Face Discord', url: 'https://huggingface.co/join/discord', tags: ['AI', 'Remote'], note: 'Open-model builders. Help people and you get noticed.' },
  { category: 'communities', name: 'Latent Space', url: 'https://www.latent.space', tags: ['AI', 'Remote'], note: 'AI engineering newsletter and podcast with an active Discord.' },
  { category: 'communities', name: 'r/developersIndia', url: 'https://www.reddit.com/r/developersIndia/', tags: ['India', 'Salary'], note: 'Huge Indian dev subreddit with hiring and salary threads.' },
  { category: 'communities', name: 'Blind', url: 'https://www.teamblind.com', tags: ['Referrals', 'Salary'], note: 'Anonymous. The easiest place to ask for referrals and check pay.' },

  // Apps and prep
  { category: 'tools', name: 'Simplify', url: 'https://simplify.jobs', tags: [], note: 'Autofills applications and tracks every one.' },
  { category: 'tools', name: 'Teal', url: 'https://www.tealhq.com', tags: [], note: 'Job tracker plus resume tailoring per role.' },
  { category: 'tools', name: 'Huntr', url: 'https://huntr.co', tags: [], note: 'Kanban board for your applications.' },
  { category: 'tools', name: 'Jobright', url: 'https://jobright.ai', tags: ['AI'], note: 'AI job matching that surfaces new roles daily.' },
  { category: 'tools', name: 'Levels.fyi', url: 'https://www.levels.fyi', tags: ['Salary'], note: 'Real compensation by company and level. Use it to negotiate.' },
  { category: 'tools', name: 'AmbitionBox', url: 'https://www.ambitionbox.com', tags: ['India', 'Salary'], note: 'Indian salaries, reviews and interview experiences.' },
  { category: 'tools', name: 'interviewing.io', url: 'https://interviewing.io', tags: ['Prep'], note: 'Anonymous mock interviews with senior engineers.' },
  { category: 'tools', name: 'Aced (formerly Exponent)', url: 'https://www.aced.io', tags: ['Prep'], note: 'Mock interviews and courses for SWE, ML and PM.' },
  { category: 'tools', name: 'NeetCode', url: 'https://neetcode.io', tags: ['Prep'], note: 'Structured DSA practice with video solutions.' },
  { category: 'tools', name: 'Grind 75', url: 'https://www.techinterviewhandbook.org/grind75/', tags: ['Prep'], note: 'A study plan sized to the weeks you have.' },
  { category: 'tools', name: 'Hello Interview', url: 'https://www.hellointerview.com', tags: ['Prep'], note: 'System design prep from ex-FAANG interviewers.' },
  { category: 'tools', name: 'ByteByteGo', url: 'https://bytebytego.com', tags: ['Prep'], note: 'System design explained visually.' },
];

export const TIPS: { title: string; body: string }[] = [
  {
    title: 'Search the ATS, not just LinkedIn',
    body: 'Most startups post on Ashby, Greenhouse or Lever before anywhere else. Use the link builder above: it searches those sites directly for your role and city.',
  },
  {
    title: 'Use VC portfolio boards',
    body: 'One search on Peak XV or Accel covers hundreds of funded companies. Few candidates know these exist, so competition is lower.',
  },
  {
    title: 'Apply in the first 48 hours',
    body: 'Set alerts for your exact title and city. Early applications get read; week-old ones sit behind hundreds of others.',
  },
  {
    title: 'A referral beats a cold apply',
    body: 'Ask an engineer at the company, not HR. Send the exact job link and three lines on why you fit, so forwarding it takes them ten seconds.',
  },
  {
    title: 'DM the hiring manager',
    body: 'Find who posted the role or leads the team. Keep it to four lines and link proof: a shipped project with a real number beats any adjective.',
  },
  {
    title: 'Build in public',
    body: 'A small tool with real users or eval results gives interviewers something concrete to ask about. Post what you learned while building it.',
  },
  {
    title: 'Mirror the job description',
    body: "Rewrite the top third of your resume for each role using the posting's own words. ATS filters and tired recruiters both scan for them.",
  },
  {
    title: 'Track everything, follow up once',
    body: 'Log every application. If you hear nothing in 5 to 7 days, send one short follow-up, then move on.',
  },
  {
    title: 'FDE roles hide under other titles',
    body: 'Also search Applied AI Engineer, AI Solutions Engineer, Customer Engineer and Agent Engineer. In India much of this work is posted under those names.',
  },
  {
    title: 'Go where builders are',
    body: 'Two meetups a month. Talk to the speakers, show your demo, ask what their team is struggling with. Most referrals start this way.',
  },
  {
    title: 'Know your number before the call',
    body: 'Check Levels.fyi and AmbitionBox for the company and level. Give a range anchored on data, not on your current salary.',
  },
  {
    title: 'Make your profiles findable',
    body: 'Same name, photo and one-line pitch on LinkedIn, X, GitHub and Peerlist. Recruiters search all four.',
  },
];

export const DM_TEMPLATE = `Hi {name}, saw you're hiring a {role} at {company}.

I'm a {your role} with {X} years building {relevant thing}. Recently I built {project}: {one real number}.

Here it is: {link}. Would you be open to a 15-minute chat, or could you point me to the right person?`;

export const REFERRAL_TEMPLATE = `Hi {name}, I'm applying for {role} at {company}: {job link}.

Quick fit check: {two lines on why you match}. Resume: {link}.

Would you be comfortable referring me? Happy to send anything that makes it easier.`;

/** Stable id per source, used for logo files and the "done" checklist. */
export const sourceId = (s: Pick<Source, 'category' | 'name'>) =>
  `${s.category}-${s.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
