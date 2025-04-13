'use client';

import Image from 'next/image';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Founder & CEO',
    image: '/team/john.jpg',
    bio: 'Passionate about helping people showcase their professional journey.',
  },
  {
    name: 'Jane Smith',
    role: 'Lead Designer',
    image: '/team/jane.jpg',
    bio: 'Creating beautiful and functional designs that make a difference.',
  },
  {
    name: 'Mike Johnson',
    role: 'Head of Development',
    image: '/team/mike.jpg',
    bio: 'Building innovative solutions to simplify CV creation.',
  },
  {
    name: 'Sarah Williams',
    role: 'AI Specialist',
    image: '/team/sarah.jpg',
    bio: 'Leveraging AI to help users create better CVs.',
  },
];

const stats = [
  { number: '50K+', label: 'CVs Created' },
  { number: '25+', label: 'Countries' },
  { number: '95%', label: 'User Satisfaction' },
  { number: '24/7', label: 'Support' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              About CV Builder
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to help professionals create outstanding CVs that get them noticed.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600">
              To empower professionals worldwide by providing them with the tools and resources they need to create compelling CVs that showcase their unique value proposition and help them achieve their career goals.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-600">
              To become the global leader in CV creation and career development, helping millions of professionals unlock their full potential through innovative technology and personalized guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white">{stat.number}</div>
                <div className="text-indigo-100 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
          <p className="mt-4 text-lg text-gray-600">
            Meet the passionate individuals behind CV Builder
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-indigo-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We constantly push boundaries to provide cutting-edge solutions for our users.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">User-Centric</h3>
              <p className="text-gray-600">
                Everything we do is focused on making our users' lives easier and helping them succeed.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                We maintain the highest standards in everything we create and deliver.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 