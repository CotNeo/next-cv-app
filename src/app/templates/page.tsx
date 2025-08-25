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
    popular: true,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with timeless elegance',
    image: '/templates/classic.png',
    category: 'Professional',
    popular: false,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior-level positions',
    image: '/templates/executive.png',
    category: 'Professional',
    popular: true,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Formal and structured layout for business professionals',
    image: '/templates/corporate.png',
    category: 'Professional',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Balanced design suitable for various industries',
    image: '/templates/professional.png',
    category: 'Professional',
    popular: false,
  },

  // Creative Templates
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and innovative design for creative professionals',
    image: '/templates/creative.png',
    category: 'Creative',
    popular: true,
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Expressive layout perfect for artists and designers',
    image: '/templates/artistic.png',
    category: 'Creative',
    popular: false,
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work with this visual-focused design',
    image: '/templates/portfolio.png',
    category: 'Creative',
    popular: false,
  },
  {
    id: 'innovative',
    name: 'Innovative',
    description: 'Unique layout that stands out from the crowd',
    image: '/templates/innovative.png',
    category: 'Creative',
    popular: false,
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Modern and stylish layout for design professionals',
    image: '/templates/designer.png',
    category: 'Creative',
    popular: false,
  },

  // Minimalist Templates
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design focusing on content',
    image: '/templates/minimal.png',
    category: 'Minimalist',
    popular: true,
  },
  {
    id: 'clean',
    name: 'Clean',
    description: 'Ultra-minimal design with maximum impact',
    image: '/templates/clean.png',
    category: 'Minimalist',
    popular: false,
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Straightforward layout that gets to the point',
    image: '/templates/simple.png',
    category: 'Minimalist',
    popular: false,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Refined minimal design with subtle sophistication',
    image: '/templates/elegant.png',
    category: 'Minimalist',
    popular: false,
  },
  {
    id: 'essential',
    name: 'Essential',
    description: 'Focus on what matters most with this streamlined design',
    image: '/templates/essential.png',
    category: 'Minimalist',
    popular: false,
  },

  // Academic Templates
  {
    id: 'academic',
    name: 'Academic',
    description: 'Formal layout suitable for academic and research positions',
    image: '/templates/academic.png',
    category: 'Academic',
    popular: false,
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Comprehensive layout for research professionals',
    image: '/templates/research.png',
    category: 'Academic',
    popular: false,
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Traditional academic layout with modern elements',
    image: '/templates/scholar.png',
    category: 'Academic',
    popular: false,
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Perfect for educators and academic administrators',
    image: '/templates/education.png',
    category: 'Academic',
    popular: false,
  },
  {
    id: 'scientific',
    name: 'Scientific',
    description: 'Structured layout for scientific professionals',
    image: '/templates/scientific.png',
    category: 'Academic',
    popular: false,
  },

  // Technical Templates
  {
    id: 'technical',
    name: 'Technical',
    description: 'Structured layout for technical professionals',
    image: '/templates/technical.png',
    category: 'Technical',
    popular: true,
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Modern layout for software developers',
    image: '/templates/developer.png',
    category: 'Technical',
    popular: false,
  },
  {
    id: 'engineer',
    name: 'Engineer',
    description: 'Professional layout for engineering roles',
    image: '/templates/engineer.png',
    category: 'Technical',
    popular: false,
  },
  {
    id: 'it',
    name: 'IT Professional',
    description: 'Comprehensive layout for IT specialists',
    image: '/templates/it.png',
    category: 'Technical',
    popular: false,
  },
  {
    id: 'data',
    name: 'Data Specialist',
    description: 'Structured layout for data professionals',
    image: '/templates/data.png',
    category: 'Technical',
    popular: false,
  },
];

const categories = [
  { name: 'All', count: templates.length },
  { name: 'Professional', count: templates.filter(t => t.category === 'Professional').length },
  { name: 'Creative', count: templates.filter(t => t.category === 'Creative').length },
  { name: 'Minimalist', count: templates.filter(t => t.category === 'Minimalist').length },
  { name: 'Academic', count: templates.filter(t => t.category === 'Academic').length },
  { name: 'Technical', count: templates.filter(t => t.category === 'Technical').length },
];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl mb-6">
              CV Şablonları
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              25+ profesyonel şablondan size en uygun olanını seçin ve kariyerinizi bir üst seviyeye taşıyın
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Şablon ara..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === category.name
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            <span className="font-semibold text-indigo-600">{filteredTemplates.length}</span> şablon bulundu
            {selectedCategory !== 'All' && (
              <span> • <span className="font-medium">{selectedCategory}</span> kategorisinde</span>
            )}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Popular Badge */}
              {template.popular && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Popüler
                  </span>
                </div>
              )}

              {/* Template Image */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">{template.name} Şablonu</p>
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    {template.category}
                  </span>
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <Link
                      href={`/dashboard/new?template=${template.id}`}
                      className="block w-full bg-white text-indigo-600 text-center py-2 px-4 rounded-lg font-medium hover:bg-indigo-50 transition-colors duration-200"
                    >
                      Bu Şablonu Kullan
                    </Link>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                    {template.name}
                  </h3>
                  {template.popular && (
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {template.description}
                </p>
                <Link
                  href={`/dashboard/new?template=${template.id}`}
                  className="inline-flex items-center justify-center w-full px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Bu Şablonu Kullan
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Şablon bulunamadı
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Arama kriterlerinizi değiştirmeyi veya farklı bir kategori seçmeyi deneyin
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
            >
              Tüm Şablonları Göster
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Henüz karar veremediniz mi?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              En popüler şablonlarımızı deneyin veya özel bir tasarım için bizimle iletişime geçin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yeni CV Oluştur
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 text-base font-medium rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 