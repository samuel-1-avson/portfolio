"use client";

import { useState } from "react";
import BlogModal from "@/components/BlogModal";

const blogPosts = [
  {
    title: "Video Fingerprinting",
    date: "December 12, 2023",
    description: "Video fingerprinting identifies videos by analyzing their visual content rather than file data. It creates a unique digital signature that allows systems to recognize a video even if it has been resized, compressed, or edited.",
    tags: ["#computerscience", "#databases", "#digitalfingerprinting"],
    url: "https://www.researchgate.net/publication/221210725_Video_fingerprinting_for_copy_identification_From_research_to_industry_applications",
    githubUrl: "https://github.com/samuel-1-avson/Video-Fingerprinting-Digital",
  },
  {
    title: "CAP Theorem",
    date: "December 10, 2023",
    description: "The CAP Theorem reveals a fundamental constraint in distributed systems. Let's unpack the trade-offs between consistency, availability, and partition tolerance.",
    tags: ["#computerscience", "#databases", "#architecture"],
    url: "https://www.ibm.com/think/topics/cap-theorem",
  },
];

const BlogSection = () => {
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPost = (post: typeof blogPosts[0]) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="blog" className="py-24 bg-transparent">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <span className="font-mono text-sm text-green-600 mb-3 block">
              $ CAT ./THOUGHTS.TXT
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-[var(--retro-fg)] mb-6">
              LATEST THOUGHTS
            </h2>
            <p className="font-mono text-base text-[var(--retro-fg)]/60 max-w-xl mx-auto leading-relaxed">
              Writing about technology and <span className="underline">how code shapes</span> ideas
            </p>
          </div>

          {/* Blog Cards - Minimal Terminal Style */}
          <div className="grid md:grid-cols-2 gap-4">
            {blogPosts.map((post, idx) => (
              <div key={idx} className="font-mono border border-[var(--retro-border)] bg-[var(--retro-bg)]">
                {/* Terminal Header - Minimal */}
                <div className="px-4 py-2 border-b border-[var(--retro-border)] flex items-center gap-2">
                  <span className="text-green-600 text-xs">$</span>
                  <span className="text-xs text-[var(--retro-fg)]/60">
                    cat post_{idx + 1}.md
                  </span>
                </div>
                
                {/* Card Body */}
                <div className="p-6">
                  {/* Date */}
                  <span className="text-xs text-[var(--retro-fg)]/40 mb-2 block">
                    {post.date}
                  </span>
                  
                  {/* Title */}
                  <h3 className="font-bold text-lg text-[var(--retro-fg)] mb-3">
                    {post.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-[var(--retro-fg)]/70 leading-relaxed mb-4">
                    {post.description}
                  </p>
                  
                  {/* Tags - Plain text */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                    {post.tags.map((tag, i) => (
                      <span 
                        key={tag}
                        className="text-xs text-[var(--retro-fg)]/50"
                      >
                        {tag}{i < post.tags.length - 1 && <span className="text-green-600 ml-3">·</span>}
                      </span>
                    ))}
                  </div>
                  
                  {/* Read More Link */}
                  <button 
                    onClick={() => openPost(post)}
                    className="text-sm text-green-600 hover:text-green-500"
                  >
                    Read Full Post →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Modal */}
      <BlogModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        post={selectedPost}
      />
    </>
  );
};

export default BlogSection;
