import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { allStateCodes } from '@/lib/states';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://phlebguide.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // State pages
  const statePages: MetadataRoute.Sitemap = allStateCodes.map((code) => ({
    url: `${baseUrl}/state/${code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // School pages from Supabase
  const { data: schools } = await supabaseAdmin
    .from('schools')
    .select('slug, updated_at')
    .order('slug');

  const schoolPages: MetadataRoute.Sitemap = (schools || []).map((school) => ({
    url: `${baseUrl}/school/${school.slug}`,
    lastModified: school.updated_at ? new Date(school.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Blog post pages from Supabase
  const { data: posts } = await supabaseAdmin
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('slug');

  const blogPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...statePages,
    ...schoolPages,
    ...blogPages,
  ];
}