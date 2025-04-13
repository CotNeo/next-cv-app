'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CVForm from '@/components/CVForm';

export default function CreateCVPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    router.push('/auth/login');
    return null;
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create CV');
      }

      const result = await response.json();
      router.push(`/dashboard/${result._id}`);
    } catch (error) {
      console.error('Error creating CV:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New CV</h1>
      <CVForm onSubmit={handleSubmit} />
    </div>
  );
} 