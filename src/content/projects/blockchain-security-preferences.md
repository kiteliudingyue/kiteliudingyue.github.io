---
title: "Estimating Investor Preferences for Blockchain Security"
description: "Using structural modeling to estimate investor preferences for blockchain security on Layer 2 networks. Published in Review of Corporate Finance."
pubDate: 2024-08-15
featured: true
tags: ["Published", "Blockchain", "Economics", "Security"]
---

## Overview

**Co-author:** Nir Chemaya
**Venue:** Review of Corporate Finance (6:3), forthcoming

This paper develops and estimates a structural model of investor preferences for blockchain security, focusing on the trade-offs between transaction costs and security guarantees on Layer 2 scaling solutions.

## Research Question

As blockchain ecosystems expand to Layer 2 (L2) networks like Polygon and Optimism, users face a fundamental trade-off: lower transaction costs versus potentially reduced security compared to Layer 1 (L1) networks. How do investors value this trade-off?

## Methodology

### Structural Model

We develop a discrete choice model where investors select between L1 and L2 networks based on:

- Transaction costs (gas fees)
- Security perceptions
- Transaction size and urgency
- Network effects

### Estimation Strategy

Using transaction-level data from Ethereum, Polygon, and Optimism, we estimate investor preferences through:

1. **Data Collection**: Millions of transactions across L1 and L2 networks
2. **Revealed Preferences**: Infer security valuations from actual network choices
3. **Maximum Likelihood Estimation**: Recover structural parameters
4. **Robustness Checks**: Validate results across different time periods and user segments

## Key Findings

### Security Discount

Our central finding: **traders anticipate a 0.68-3.29% loss probability on L2 versus L1**. This represents investors' implicit valuation of reduced security guarantees on Layer 2 networks.

### Heterogeneity

We document substantial heterogeneity in security preferences:

- **Institutional investors**: Higher sensitivity to security (premium of 2-3%)
- **Retail traders**: More cost-sensitive (premium of 0.7-1.5%)
- **DeFi users**: Intermediate preferences depending on application

### Transaction Size Effects

Security preferences scale with transaction size:

- Small transactions (<$100): Minimal security premium
- Medium transactions ($100-$10K): Moderate premium (~1.5%)
- Large transactions (>$10K): Substantial premium (>2.5%)

## Implications

### For Network Designers

Our results inform L2 design choices:

1. **Security-Cost Trade-offs**: Quantifies the market demand for security
2. **Pricing Strategies**: Optimal fee structures given security perceptions
3. **Marketing Messaging**: How to communicate security features effectively

### For Investors

The findings help investors understand:

- Implicit costs of using L2 networks
- When L2 usage is economically rational
- Portfolio implications of multi-chain strategies

### For Policymakers

The structural estimates provide insights for:

- Systemic risk assessment in multi-layer blockchain systems
- Consumer protection considerations
- Regulatory framework design

## Robustness and Validation

We validate our results through multiple approaches:

### Alternative Specifications

- Different functional forms for utility
- Various controls for network congestion
- Robustness to sample restrictions

### External Validation

- Survey data on security perceptions
- Comparison with insurance premium data
- Out-of-sample prediction tests

## Model Extensions

The framework can be extended to analyze:

- Cross-chain bridges and their security implications
- Novel L2 technologies (ZK-rollups vs. optimistic rollups)
- Dynamic security learning by investors

## Conclusion

This research provides the first structural estimates of investor preferences for blockchain security. The findings demonstrate that users place economically significant value on security guarantees, with substantial heterogeneity across investor types and transaction sizes.

The methodology and results contribute to understanding how security considerations shape the adoption and evolution of multi-layer blockchain ecosystems.

## Citation

Liu, Dingyue (Kite) and Nir Chemaya. "Estimating Investor Preferences for Blockchain Security." *Review of Corporate Finance* 6, no. 3 (forthcoming).

## Related Work

- [What Drives Liquidity on Decentralized Exchanges?](./liquidity-drivers-dexs)
- [The Power of Default: Slippage Tolerance Study](./slippage-tolerance-defaults)
