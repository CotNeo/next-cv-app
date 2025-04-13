import Image from 'next/image';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  content,
  image,
}: TestimonialCardProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {name}
          </h3>
          <p className="text-gray-600">
            {role} at {company}
          </p>
        </div>
      </div>
      <p className="text-gray-600">{content}</p>
    </div>
  );
} 