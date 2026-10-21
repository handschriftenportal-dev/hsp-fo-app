## Fachlich
- [ ] Barrierefreiheit(WCAG 2.0 AA) - Überprüfung mittels [Easy Checks](https://bik-fuer-alle.de/easy-checks.html) oder DevTools Lighthouse Score.  
- [ ] SEO
- [ ] Mehrsprachigkeit / i18n
## Codequalität
- [ ] CI Pipeline Build erfolgreich
- [ ] Statische Codeanalyse erkennt keine neuen Probleme
- [ ] Semantic Versioning beachtet
- [ ] Dokumentation in [ARC42](https://code.dev.sbb.berlin/sbb/documentation/blob/master/markdown/md_template.md) bzw. [ADR](https://code.dev.sbb.berlin/HSP/documentation/-/tree/master/Architekturentscheidungen) ist aktuell 
- [ ] API-Dokumentation ist aktuell
- [ ] Codereview durchgeführt
- Optional
    - [ ] Testabdeckung (wünschenswert ≥80% Unit Test)
    - [ ] Code-Dokumentation
## Infrastruktur
- [ ] Feature ist auf dem Testsystem installiert
- [ ] Artefakt auf dem Artefakt Server ist erstellt
- betriebliche Vorgaben sind erfüllt
    - [ ] Logging
    - [ ] Serviceregistry
    - [ ] Debian / NPM Paket
    - [ ] Service unter Linux bootpersistent
    - [ ] Konfigurationsmanagement(dev, stage, prod, test)

Aktuelle Fassung Definition of Done: https://code.dev.sbb.berlin/HSP/documentation/-/blob/master/resources/dod.md
