---
title: "Not All LPs Are Equal: The Active-Passive Gap in Automated Market Maker Liquidity Provision"
description: |
  Liquidity provision in automated market makers is typically analyzed at the pool level, implicitly assuming LP homogeneity. This aggregate view can hide how liquidity provision outcomes differ between LP strategies, particularly as concentrated liquidity AMM designs operating on high performance blockchains allow liquidity to be actively repositioned around trades.

  We develop a markout-based framework to decompose Uniswap LP profitability into active and passive components using two complementary methods: a LIFO subtraction method that matches short-lived mint-burn positions and attributes swap-level markouts by liquidity share; and an infinitesimal LP benchmark that estimates the performance of a fully passive, always-in-range marginal LP directly from the AMM price path.

  We apply these methods to Uniswap v2, v3, and v4 pools on Ethereum, Arbitrum, and Base chains, and find passive profitability can materially differ from aggregate pool profitability. In Uniswap v2, with liquidity distributed evenly and active LP behavior nearly absent, the overall and passive markouts are almost the same. In contrast, concentrated-liquidity pools have a systematic active-passive gap: passive LPs tend to underperform aggregate pool-level measures. The gap is wider on Ethereum than on L2s, consistent with active liquidity provision being more useful when block times and ordering conditions allow LPs to react to incoming flow. In general, passive LPs perform better on higher fee pools. The LIFO and infinitesimal estimates are generally consistent directionally across most pools, providing evidence of the robustness of the decomposition. The results suggest that adverse selection in AMMs is not evenly distributed among LPs, with important implications for LP strategy, fee-tier design, and measurement of DEX market quality.
pubDate: 2026-05-01
authors:
  - name: "Agathe Sadeghi"
  - name: "Ciamac Moallemi"
    url: "https://moallemi.com/ciamac/"
  - name: "Xin Wan"
    url: "https://wanxinwanxin.github.io/"
  - name: "Brian Zhu"
    url: "https://sites.google.com/view/brianzhu"
hook: "One pool, many hands. / Passive liquidity bleeds. / Active hands adjust."
venue: "Under review"
status: "Working Paper"
featured: true
sortOrder: 1
---
