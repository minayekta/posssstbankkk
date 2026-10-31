# Post Bank Iran — legacy functionality integration

**Baseline:** Postbank v7 — Homepage Refresh, with Postino experience intact.

## Implemented UI/navigation
- Main services retains animated scatter-to-grid cards; full service groups under `/services/category/{currency,rial,identified,special}` show all names from the supplied legacy-site specification.
- New informational pages: `/e-desk`, `/transparency`, `/participation`, `/support`, `/market`, `/accessibility`, `/en`, `/tools/date-converter`; customized 404.
- Search includes legacy group names and individual service names.
- Header service mega menu; primary links to e-desk and transparency; accessible presentation panel; top-bar English overview.
- Homepage keeps cinematic hero, services motion, products, news, split chart, Postino link and adds a compact market-information band and institutional access cards. No redundant quick-access section was reintroduced.
- Support: FAQ search and validated local-only request-draft form; participation: non-persistent sample poll; date converter: client-side Persian calendar formatting.
- RSS sample news feed available at `/rss.xml`.

## Production integrations still required
- Official bank-approved service descriptions, routing, documents, translated English pages, accessibility audit, vetted institutional media/brand assets.
- Secure case-management APIs for requests, complaints, polling, online appointments and chatbot if mandated. Demo form **never sends or stores requests**.
- Verified historical and live market-rate APIs for exchange rates, deposit interest and share prices. No live prices are invented.
- Server-side visitor statistics, IP display (privacy-reviewed), content management and publishing permissions, moderation, security audits.
- The site is NOT an official production banking site; all online transactions must occur within verified bank systems.

## Quality checks
TypeScript/TSX was parsed for syntax validity using installed TypeScript. Dependency installation and framework build were not performed in the environment, so runtime verification is pending.
