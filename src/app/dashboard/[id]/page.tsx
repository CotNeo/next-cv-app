'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CVForm from '@/components/CVForm';
import Link from 'next/link';

interface CV {
  _id: string;
  title: string;
  data: any;
  createdAt: string;
  atsScore: number;
  aiSuggestions: string[];
}

export default function CVDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cv, setCV] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCV();
    }
  }, [status, params.id]);

  const fetchCV = async () => {
    try {
      const response = await fetch(`/api/cv/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch CV');
      }

      const data = await response.json();
      setCV(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching CV:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/cv/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update CV');
      }

      const result = await response.json();
      setCV(result);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating CV:', error);
    }
  };

  const handleATSReview = async () => {
    try {
      const response = await fetch(`/api/cv/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'ats-review',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get ATS review');
      }

      const result = await response.json();
      setCV((prev) => prev ? { ...prev, aiSuggestions: [result] } : null);
    } catch (error) {
      console.error('Error getting ATS review:', error);
    }
  };

  const handleTranslate = async (targetLanguage: string) => {
    try {
      const response = await fetch(`/api/cv/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'translate',
          data: { targetLanguage },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to translate CV');
      }

      const result = await response.json();
      setCV((prev) => prev ? { ...prev, data: JSON.parse(result) } : null);
    } catch (error) {
      console.error('Error translating CV:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (!cv) {
    return <div>CV not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-900"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-2">{cv.title}</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={handleATSReview}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Get ATS Review
          </button>
        </div>
      </div>

      {isEditing ? (
        <CVForm initialData={cv.data} onSubmit={handleSubmit} />
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">ATS Score</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${cv.atsScore}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {cv.atsScore}% ATS compatibility
            </p>
          </div>

          {cv.aiSuggestions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">AI Suggestions</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">{cv.aiSuggestions[0]}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p className="text-gray-700">{cv.data.summary}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Work Experience</h2>
            {cv.data.experiences.map((exp: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="font-medium">{exp.title}</h3>
                <p className="text-gray-600">
                  {exp.company} • {exp.location}
                </p>
                <p className="text-gray-500">
                  {new Date(exp.startDate).toLocaleDateString()} -{' '}
                  {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Education</h2>
            {cv.data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="font-medium">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-gray-500">
                  {new Date(edu.startDate).toLocaleDateString()} -{' '}
                  {edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {cv.data.skills.map((skill: any, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {skill.name} ({skill.level}/5)
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {cv.data.languages.map((lang: any, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {lang.name} ({lang.level})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 