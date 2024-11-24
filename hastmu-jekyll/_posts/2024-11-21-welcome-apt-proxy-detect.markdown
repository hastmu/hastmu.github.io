---
layout: post
title:  "Welcome APT-PROXY-DETECT..."
date:   2024-11-21
categories: apt-proxy-detect
---

# apt-proxy-detect
Auto detection of apt proxies in the LAN, caching and checking status of it.

In one sentence, set or let it find your proxies from work, school or from at home,
it does not matter, it takes the working ones or none (direct connect), where ever you are.

apt-proxy-detect can be used as on clients to detect apt-cacher-ng or squid-deb-proxy in your network.

# Why this is needed?
Spending 2023 time on this topic sound/reads quite strange but up to now
i struggle with some problems within the solutions i found so far.

Issues:
* No reliable detect proxies via mDns. (Timeouts, not found)
* No caching of the found proxies.
* No check if the found proxy works for the requested target.
* No longer active maintained (deprecated warnings all over the place)

# Where to find?
* On Github i use [https://github.com/hastmu/apt-proxy-detect](https://github.com/hastmu/apt-proxy-detect)
* Branches
  * main = unstable
  * release/* = stable

