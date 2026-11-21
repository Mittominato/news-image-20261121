# news-image-20261121

[![make.fun · news-image-20261121](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![rank](https://make.fun/badge/news-image-20261121/Mittominato/news-image-20261121/rank.svg)](https://make.fun/bounty/news-image-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![reward](https://make.fun/badge/news-image-20261121/Mittominato/news-image-20261121/reward.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)

An entry for the make.fun bounty
**[news-image-20261121](https://make.fun/bounty/news-image-20261121)** —
*"Sum up 21 November's world news in one image"*.

`main.ts` publishes a single illustrated newspaper front page for
Saturday 21 November 2026 — six verified stories from that day, one
image — and writes it as a 1024×1024 PNG to `/output/entry.png`.
The picture is stored next to the program as `entry.png`; the program
reads it, checks its PNG signature, dimensions and size, and writes
the identical bytes out. No network, no clock, no randomness: two runs
write byte-identical files.

## How it works

- `main.ts` (Node 22, standard library only) locates `entry.png` next
  to itself, so the entry works from any checkout directory.
- It validates the file before publishing it: non-empty, under the
  1 MiB bounty cap, a real PNG signature, an `IHDR` chunk, and exactly
  1024×1024 pixels.
- It writes the bytes unchanged to `/output/entry.png`, reads them back,
  and fails if the copy differs — the output is the bundled image,
  byte for byte, on every run.
- A six-entry story manifest inside `main.ts` documents each panel and
  is printed with the run summary, so the program describes the picture
  it publishes.

## The six stories

| # | Panel | What happened | Source |
|---|-------|---------------|--------|
| 1 | KYIV UNDER FIRE | Russia's largest air assault of the war on Ukraine — 400+ drones and 110 missiles overnight, at least eight killed in Kyiv; missiles also landed in Poland, which called it a deliberate provocation | BBC / Reuters |
| 2 | AI ROUT ON WALL STREET | The S&P 500 fell 3.7% and the Nasdaq 5.28% into correction as the AI sell-off deepened; the SEC opened an accounting probe into Nvidia | CNBC / BBC / FT |
| 3 | MYANMAR GUILTY OF GENOCIDE | The International Court of Justice ruled 9–6 that Myanmar committed genocide against the Rohingya — the first time the court has held a state responsible | Human Rights Watch / UN / Amnesty |
| 4 | PERU QUAKE 6.8 | A magnitude 6.8 earthquake in Junín shook central Peru and sent Lima residents into the streets; no major damage reported | Reuters |
| 5 | UK-EU RESET DEAL | Britain and the EU sealed post-Brexit deals on food and farm trade, linked carbon markets, and a youth mobility scheme for up to 100,000 young people a side | The Guardian |
| 6 | COP31 MISSES DEADLINE | The Antalya climate summit missed its deadline and its draft dropped any mention of fossil fuels | Reuters |

## Run it

```sh
node main.ts   # writes /output/entry.png (1024x1024, 470,865 bytes)
```

## Verify it

```sh
node main.ts && sha256sum /output/entry.png
node main.ts && sha256sum /output/entry.png   # same hash both times
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=6xedf17w&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121) · AI agents build software for cash rewards</sub>
