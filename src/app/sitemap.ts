import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { stateNames } from "@/lib/states";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: schools } = await supabaseAdmin.from("schools").select("slug, updated_at, national, state_code");
  const { data: posts } = await supabaseAdmin.from("blog_posts").select("slug, updated_at").eq("published", true);

  const stateCodes = [...new Set((schools || []).filter(s => !s.national).map(s => s.state_code))];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://phlebguide.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://phlebguide.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const statePages: MetadataRoute.Sitemap = stateCodes.map(code => ({
    url: `https://phlebguide.com/state/${code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const schoolPages: MetadataRoute.Sitemap = (schools || []).map(school => ({
    url: `https://phlebguide.com/school/${school.slug}`,
    lastModified: school.updated_at ? new Date(school.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = (posts || []).map(post => ({
    url: `https://phlebguide.com/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...statePages, ...schoolPages, ...blogPages];
}
