// Destinations copied from the postbank.ir homepage HTML supplied for this demo.
export const officialLinks = {
  hampa: "https://hampa.postbank.ir/",
  internetBank: "https://mobile.pb724.com/netway/index",
  greenHouse: "https://green.postbank.ir",
  hamta: "https://set.postbank.ir/",
  mobileTopup: "https://ib.postbank.ir/webbank/login/loginPage.action?ibReq=WEB",
  history: "https://www.postbank.ir/web/guest/%D8%AA%D8%A7%D8%B1%DB%8C%D8%AE%DA%86%D9%87",
  mission: "https://www.postbank.ir/web/guest/%D8%A8%DB%8C%D8%A7%D9%86%DB%8C%D9%87-%D9%85%D8%A7%D9%85%D9%88%D8%B1%DB%8C%D8%AA",
  vision: "https://www.postbank.ir/web/guest/%D8%A8%DB%8C%D8%A7%D9%86%D9%87-%DA%86%D8%B4%D9%85-%D8%A7%D9%86%D8%AF%D8%A7%D8%B2",
  socialResponsibility: "https://www.postbank.ir/web/guest/social_responsibility",
  ethics: "https://www.postbank.ir/web/guest/code-of-ethics",
  customerRights: "https://www.postbank.ir/web/guest/customer-rights-charter",
  gallery: "https://www.postbank.ir/web/guest/gallery",
  visualArchive: "https://www.postbank.ir/Information-activities",
} as const;

export const productDestinations: Record<string, string> = {
  hampa: officialLinks.hampa,
  "internet-bank": officialLinks.internetBank,
  hamta: officialLinks.hamta,
  "green-house": officialLinks.greenHouse,
};
