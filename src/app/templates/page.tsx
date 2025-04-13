'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const templates = [
  // Professional Templates
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design with a modern touch',
    image: '/templates/modern.png',
    category: 'Professional',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with timeless elegance',
    image: '/templates/classic.png',
    category: 'Professional',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior-level positions',
    image: '/templates/executive.png',
    category: 'Professional',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Formal and structured layout for business professionals',
    image: '/templates/corporate.png',
    category: 'Professional',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Balanced design suitable for various industries',
    image: '/templates/professional.png',
    category: 'Professional',
  },

  // Creative Templates
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and innovative design for creative professionals',
    image: '/templates/creative.png',
    category: 'Creative',
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Expressive layout perfect for artists and designers',
    image: '/templates/artistic.png',
    category: 'Creative',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work with this visual-focused design',
    image: '/templates/portfolio.png',
    category: 'Creative',
  },
  {
    id: 'innovative',
    name: 'Innovative',
    description: 'Unique layout that stands out from the crowd',
    image: '/templates/innovative.png',
    category: 'Creative',
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Modern and stylish layout for design professionals',
    image: '/templates/designer.png',
    category: 'Creative',
  },

  // Minimalist Templates
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design focusing on content',
    image: '/templates/minimal.png',
    category: 'Minimalist',
  },
  {
    id: 'clean',
    name: 'Clean',
    description: 'Ultra-minimal design with maximum impact',
    image: '/templates/clean.png',
    category: 'Minimalist',
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Straightforward layout that gets to the point',
    image: '/templates/simple.png',
    category: 'Minimalist',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Refined minimal design with subtle sophistication',
    image: '/templates/elegant.png',
    category: 'Minimalist',
  },
  {
    id: 'essential',
    name: 'Essential',
    description: 'Focus on what matters most with this streamlined design',
    image: '/templates/essential.png',
    category: 'Minimalist',
  },

  // Academic Templates
  {
    id: 'academic',
    name: 'Academic',
    description: 'Formal layout suitable for academic and research positions',
    image: '/templates/academic.png',
    category: 'Academic',
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Comprehensive layout for research professionals',
    image: '/templates/research.png',
    category: 'Academic',
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Traditional academic layout with modern elements',
    image: '/templates/scholar.png',
    category: 'Academic',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Perfect for educators and academic administrators',
    image: '/templates/education.png',
    category: 'Academic',
  },
  {
    id: 'scientific',
    name: 'Scientific',
    description: 'Structured layout for scientific professionals',
    image: '/templates/scientific.png',
    category: 'Academic',
  },

  // Technical Templates
  {
    id: 'technical',
    name: 'Technical',
    description: 'Structured layout for technical professionals',
    image: '/templates/technical.png',
    category: 'Technical',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Modern layout for software developers',
    image: '/templates/developer.png',
    category: 'Technical',
  },
  {
    id: 'engineer',
    name: 'Engineer',
    description: 'Professional layout for engineering roles',
    image: '/templates/engineer.png',
    category: 'Technical',
  },
  {
    id: 'it',
    name: 'IT Professional',
    description: 'Comprehensive layout for IT specialists',
    image: '/templates/it.png',
    category: 'Technical',
  },
  {
    id: 'data',
    name: 'Data Specialist',
    description: 'Structured layout for data professionals',
    image: '/templates/data.png',
    category: 'Technical',
  },
];

const categories = ['All', 'Professional', 'Creative', 'Minimalist', 'Academic', 'Technical'];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect CV Template
          </h1>
          <p className="text-xl text-gray-600">
            Select from our professionally designed templates to create your standout CV
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {template.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <Link
                  href={`/dashboard/new?template=${template.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Use This Template
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 