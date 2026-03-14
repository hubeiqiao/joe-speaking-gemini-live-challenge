# Devpost Draft

## Title

Joe Speaking: Gemini Live Speaking Coach

## One-Line Summary

A Gemini-powered live speaking coach that lets learners practice realistic conversation, retry the same topic, and see visible improvement across attempts.

## Built With

- Gemini
- Google GenAI SDK
- Google Cloud Run
- Next.js

## Problem

Speaking practice tools often feel artificial. Learners either record into a static prompt or lose track of how they improved on the same topic over time.

## Solution

This challenge build turns Joe Speaking into a Gemini Live judge demo:

- talk live with Gemini
- open a public judge demo with no production-data dependency
- use push-to-talk microphone capture or typed fallback replies
- receive a structured recap
- retry the same topic
- compare versions and improvement

## Google Cloud Usage

- Cloud Run hosts the challenge app and backend
- Secret Manager stores server-side secrets

## What Makes It Fit Live Agents

- the core experience is a real-time live conversation
- Gemini is the active speaking partner
- the product loop depends on live response, recap, and same-topic re-practice
