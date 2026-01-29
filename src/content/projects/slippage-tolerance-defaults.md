---
title: "The Power of Default: Measuring the Effect of Slippage Tolerance in Decentralized Exchanges"
description: "Examining Uniswap's dynamic default slippage setting and its dramatic impact on reducing sandwich attacks and protecting traders."
pubDate: 2024-03-20
featured: true
tags: ["Published", "DeFi", "MEV", "User Protection"]
liveUrl: "https://fc24.ifca.ai/"
---

## Overview

**Co-authors:** Nir Chemaya, Robert McLaughlin, Nicola Ruaro, Christopher Kruegel, Giovanni Vigna

**Venue:** International Conference on Financial Cryptography and Data Security 2024

This paper provides the first large-scale empirical analysis of how default parameter settings affect user protection in decentralized exchanges, with dramatic findings on sandwich attack mitigation.

## Background

### Sandwich Attacks

Sandwich attacks are a form of MEV (Maximal Extractable Value) where attackers:

1. Observe a pending transaction
2. Submit a transaction before it (front-run)
3. Submit a transaction after it (back-run)
4. Profit from the price movement they cause

### Slippage Tolerance

Slippage tolerance defines the maximum acceptable price deviation for a trade. It serves as a key defense against sandwich attacks—but most users don't manually adjust it.

## The Natural Experiment

In August 2021, Uniswap changed its default slippage tolerance from:

- **Static default**: 0.5% for all trades
- **Dynamic default**: Varies based on trade characteristics and volatility

This change created a natural experiment to measure the impact of defaults on user outcomes.

## Data and Methodology

### Dataset

- **Period**: 6 months before and after the change (March 2021 - February 2022)
- **Transactions**: Millions of Uniswap trades
- **Sandwich Detection**: Novel algorithm to identify sandwich attacks
- **User Classification**: Separate users who accept defaults vs. those who customize

### Identification Strategy

We employ a difference-in-differences approach:

```
Outcome_it = β₀ + β₁(Dynamic_t × DefaultUser_i) + γ_i + δ_t + ε_it
```

where:
- `Dynamic_t`: Indicator for post-change period
- `DefaultUser_i`: Users who accept default settings
- `γ_i`: User fixed effects
- `δ_t`: Time fixed effects

## Key Findings

### Overall Impact

The dynamic default reduced sandwich attack losses by **54.7%** across all users—a massive improvement in trader protection.

### Heterogeneous Effects

Impact varied dramatically by user type:

| User Type | Loss Reduction |
|-----------|---------------|
| Default users (90% of traders) | **90%** |
| Custom users | 12% |
| Sophisticated traders | 8% |

### Mechanism

The dynamic default works by:

1. **Volatility adjustment**: Tightens tolerance in stable markets
2. **Trade size scaling**: Adjusts based on transaction impact
3. **Real-time calculation**: Uses current market conditions

## Economic Magnitude

### Aggregate Savings

Over the 6-month post-change period:

- **Total savings**: $47 million in prevented losses
- **Per user**: Average savings of $120 per default user
- **Daily impact**: ~$260,000 in daily loss prevention

### Distributional Effects

The benefits accrued primarily to retail traders:

- **Small trades (<$1K)**: 95% loss reduction
- **Medium trades ($1K-$10K)**: 75% loss reduction
- **Large trades (>$10K)**: 35% loss reduction

## Why Defaults Matter

### Behavioral Economics

Our results highlight several behavioral phenomena:

1. **Default Bias**: 90% of users accept defaults without adjustment
2. **Information Asymmetry**: Most users don't understand slippage implications
3. **Inertia**: Even sophisticated users often don't customize settings

### Design Implications

The findings demonstrate that **platform design choices have first-order effects** on user outcomes in DeFi.

## Robustness Tests

We validate our results through:

### Alternative Specifications

- Different sandwich attack definitions
- Various control variables
- Placebo tests using non-affected platforms

### External Validity

- Replication on other DEXs that adopted similar changes
- Analysis of related MEV protection mechanisms
- Comparison with centralized exchange protections

## Policy Implications

### For Protocol Designers

1. **Default optimization** should be a priority
2. **Dynamic defaults** outperform static ones
3. **User education** remains important but insufficient

### For Users

- Accepting smart defaults can provide better protection than manual adjustment
- Understanding the mechanism helps recognize when customization is needed

### For Regulators

- Platform design choices significantly impact user protection
- May warrant disclosure requirements for default settings
- Suggests need for MEV-aware consumer protection frameworks

## Extensions and Future Work

The methodology can be applied to study:

- Other default parameters in DeFi (gas settings, deadline parameters)
- Cross-platform effects of protection mechanisms
- Long-run evolution of attack strategies

## Conclusion

This research demonstrates the profound impact of default settings on user outcomes in decentralized finance. The 54.7% reduction in sandwich attack losses—reaching 90% for default users—shows that thoughtful platform design can dramatically improve user protection without sacrificing decentralization.

The results challenge the assumption that user education alone can solve DeFi's user protection challenges, instead highlighting the critical role of well-designed defaults.

## Citation

Chemaya, Nir, Dingyue (Kite) Liu, Robert McLaughlin, Nicola Ruaro, Christopher Kruegel, and Giovanni Vigna. "The Power of Default: Measuring the Effect of Slippage Tolerance in Decentralized Exchanges." *International Conference on Financial Cryptography and Data Security*, 2024.

## Code and Data

- Analysis code: [GitHub Repository](https://github.com/)
- Dataset documentation: Available upon request
- Replication package: [OSF Project Page](https://osf.io/)

## Media Coverage

This work has been featured in:
- CoinDesk
- The Block
- Decrypt
- Various academic and industry podcasts
