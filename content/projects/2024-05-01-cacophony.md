---
title: "Sound Pedro 2024: Cacophony"
date: 2024-05-01
headerImage: false
tag:
  - spatial-audio
  - psychoacoustics
  - performance
  - audio
author: jackson
description: "A sonic installation exploring live networked media for Sound Pedro 2024"
emoji: 💥
navPhrase: "Sound can be cool and distressing - there's also {}?"
---

# Sound Pedro 2024

This year I presented a sonic installation at Sound Pedro alongside a cohort of other artists presenting wacky and experimental audio works. Initially, I thought it would just make sense to write up a technical overview of my piece but the whole experience and very existence of Sound Pedro made me think it would be interesting to tell a story alongside the technical details.

## A little context

In 2021, prior to moving to Long Beach, I was first introduced to the cast of wacky sound artists that regularly filled San Pedro each year. For those unacquainted with the south coast of LA, San Pedro is a sleepy blue-collar town perched right off the massive twin ports of LA and Long Beach. I would have never ended up in that town had an up-end for a co-worker of a friend who liked to "get a shit-ton of speakers and wire up an array". Now that's my kind of stuff.

{% figure "/vid/tape.mp4", "Playing the sound of tape, unspooled between chairs and concrete" %}

That's my time at Oslo at school for an esoteric degree in music technology. I had always wanted to put up my own sound insulation. The idea of occupying some permanent sonic space that people might pass through and observe thought was genuinely so cool. When I saw dozens and dozens of weirdos scattered around the Angels Gate Cultural Center I was beaming.

My installation was actually a much older project spurred at an "a-ha" kind of observation during a sonification class at the University of Oslo. Part of one of our projects involved capturing and repurposing ["found sounds"](https://en.wikipedia.org/wiki/Found_object_%28music%29) from YouTube (yes, I know that there are many more appropriate places). This led me to become quite familiar with the Swiss Army Knife of Media, FFmpeg. In some rabbit hole, I found it had the little-known option to pull a partial clip from a video at any time marker. My mind raced. Could you pull exclusively audio? What was the size of a 30-second clip? 300 kilobytes. Could I download clips 10 at once - was there throttling? For whatever reason, Google appears to be quite lenient with YouTube's access.

Cacophony was a small project that took a random list of URLs of YouTube links and would fade in and out clips of audio from these videos. What made the sounds being heard all the more interesting was that they were scraped. They were scraped and direct relationship to YouTube's recommendation system. I wrote a simple crawler to start the home page and click random links, collect YouTube URLs, and then repeat. Hearing this traversal becomes a lot more interesting with context in mind.

All the code is open-source - [check it out here](https://github.com/jacksongoode/cacophony/). I plan to make a more technical write up with some details on the entire system. In the meantime, you can read the very ostentatious description I submitted.

> Cacophony is an immersive sound installation that attempts to capture the inundation of modern media hosting platforms through their traversal. Sites like YouTube, TikTok, Instagram, among others, provide users with virtually boundless and aggressively curated content. Though thought of as visual platforms, sound holds arguably equal weight in the luring of users to their hosted content. Through the programmatic collection and extraction of media, sounds once bound by the frame of moving images are played out of place and time. This siphoning of audio from these clips occurs in real time and is hemmed by restrictions both from the network and media host. Simultaneously, thumbnails from the videos are retrieved, projected and refracted across the local surroundings, further emphasizing the blurred boundaries of sound. “Cacophony” serves disjointed, aural moments from the navigation of these platforms to reflect on how they vie for our attention with often overwhelming consequences.

For the installation, I wanted to go as big as I could under my strict budget of $60. After some extensive Facebook marketplace sleuthing, I found a five-channel home speaker setup with an amplifier. I spent a few more hours than I should, reprograming the script and getting everything to work in a five-channel array (all programmed in Python - yes, you heard that's right. An a-sync real-time multi-channel installation in Python - clearly the best language for this use-case).

{% figure "/vid/pad.mp4", "My spot" %}

The hours preparing before Sound Pedro were just as frantic as it was the first time arriving on that defunct naval base. I spent the past night dusting off speakers, cutting wire, frantically coding and adding catches for robustness and so the speakers wouldn't accidentally explode. Yet, there was very little at home to give an impression of the concrete cave I would be in.

I was happy when my friends quietly appeared in the stream of visitors.

{% figure "surprise.jpg", "Me, surprised" %}

## After the noise

Like with a lot of art projects, you spend far more time invested, perfecting, tuning, scrutinizing than anyone will ever see. When I came down to setting up the space, I decided to bring my whole living room up and into whatever space I would be given. Lamps, lights, chairs, my table. Mine turned out to be one of the coziest concrete bungalows there.

With some continued routing woes, I wasn't able to project the colorful display of video thumbnails as I intended, so I used my laptop's display instead. Folks passing by were excited, confused, disturbed, entertained, and generally interested, since there is very little visual indication of all of the many simultaneous streams of audio that were booming off the semi-circular apartment I was squatting in for the evening.

{% figure "/vid/ongoing.mp4", "A quick clip - sadly the drones of the surrounding performances did just that :)" %}
