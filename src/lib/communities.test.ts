import { describe, expect, it } from 'vitest';
import { communityInputSchema } from './communities.functions';

const base = {
  name: 'Campus Hackathon Teams',
  platform: 'WhatsApp',
  category: 'Technology',
  description: 'Find teammates for upcoming hackathons.',
  tags: ['hackathon'],
  audience: 'College students',
  location: 'Campus-based',
  url: '',
};

describe('communityInputSchema', () => {
  it('accepts a valid community without a join link', () => {
    expect(communityInputSchema.safeParse(base).success).toBe(true);
  });
  it('accepts official WhatsApp, Discord, Telegram and Reddit links', () => {
    for (const url of ['https://chat.whatsapp.com/abc123', 'https://wa.me/15551234567', 'https://discord.gg/abcde', 'https://discord.com/invite/abcde', 'https://t.me/mygroup', 'https://reddit.com/r/example']) {
      expect(communityInputSchema.safeParse({ ...base, url }).success).toBe(true);
    }
  });
  it('rejects links outside the official platforms', () => {
    for (const url of ['https://evil.example.com/whatsapp', 'http://chat.whatsapp.com/abc', 'https://whatsapp.com.evil.com/x', 'not-a-url']) {
      expect(communityInputSchema.safeParse({ ...base, url }).success).toBe(false);
    }
  });
  it('rejects unknown platforms and categories', () => {
    expect(communityInputSchema.safeParse({ ...base, platform: 'Slack' }).success).toBe(false);
    expect(communityInputSchema.safeParse({ ...base, category: 'Sports' }).success).toBe(false);
  });
  it('rejects names and descriptions that are too short', () => {
    expect(communityInputSchema.safeParse({ ...base, name: 'A' }).success).toBe(false);
    expect(communityInputSchema.safeParse({ ...base, description: 'short' }).success).toBe(false);
  });
  it('rejects more than 12 tags', () => {
    expect(communityInputSchema.safeParse({ ...base, tags: Array.from({ length: 13 }, (_, i) => `t${i}`) }).success).toBe(false);
  });
});
