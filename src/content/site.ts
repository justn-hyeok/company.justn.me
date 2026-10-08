type LegalDetails = {
  registrationNumber?: string;
  address?: string;
  /** English rendering of the address, used on /en. */
  addressEn?: string;
  phone?: string;
};

export const site = {
  name: "Justn",
  domain: "company.justn.me",
  url: "https://company.justn.me",
  email: "ceo@justn.me",
  github: "https://github.com/justn-hyeok",
  githubHandle: "justn-hyeok",
  portfolio: "https://justn.me",
  founder: {
    name: "황준혁",
    latinName: "Junhyeok Hwang",
    github: "https://github.com/justn-hyeok",
    portfolio: "https://justn.me",
  },
  foundedYear: 2026,
  foundedDate: "2026-05-31",
  /** Business days promised for a first reply to email. */
  responseDays: 2,
  // Publish these details only after they have been confirmed.
  legal: {
    registrationNumber: "",
    address: "경상남도 김해시",
    addressEn: "Gimhae-si, Gyeongsangnam-do, Republic of Korea",
    phone: "",
  } as LegalDetails,
  copyrightYear: 2026,
  legalUpdated: "2026-10-08",
} as const;
