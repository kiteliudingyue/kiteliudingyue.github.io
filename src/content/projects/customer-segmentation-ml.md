---
title: "Customer Segmentation with Machine Learning"
description: "Applied K-means clustering and RFM analysis to segment 100K+ customers, enabling targeted marketing campaigns that improved conversion rates by 28%."
pubDate: 2025-11-20
featured: true
tags: ["Machine Learning", "Python", "Data Analysis", "Clustering"]
image: "/images/projects/segmentation-preview.png"
videoUrl: "/videos/segmentation-demo.mp4"
githubUrl: "https://github.com/kiteliudingyue/customer-segmentation"
---

## Project Background

E-commerce companies need to understand their customer base to create effective marketing strategies. This project analyzes customer behavior patterns to identify distinct segments for targeted campaigns.

## Methodology

### Data Collection & Cleaning
- Analyzed 100,000+ customer transaction records
- Cleaned and normalized data using pandas
- Feature engineering: RFM scores, purchase frequency, lifetime value

### Clustering Analysis
- Applied K-means clustering algorithm
- Used elbow method to determine optimal cluster count (k=5)
- Validated clusters using silhouette analysis

### Visualization
- Interactive scatter plots with Plotly
- Cluster characteristics heatmap
- Customer journey flow diagrams

## Results

- Identified 5 distinct customer segments
- "High-value Champions" segment (8% of customers, 42% of revenue)
- "At-risk" segment targeted with retention campaigns
- Overall conversion rate improved by 28%

## Tools & Technologies

- Python (pandas, scikit-learn, NumPy)
- Jupyter Notebooks for analysis
- Plotly & Matplotlib for visualization
- PostgreSQL for data storage
