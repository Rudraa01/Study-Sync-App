'use client';

import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  TrophyIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Smart Study Sessions',
    description: 'Optimize your study time with AI-powered scheduling and focus tracking.',
    icon: ClockIcon,
  },
  {
    name: 'Interactive Flashcards',
    description: 'Create and study with dynamic flashcards that adapt to your learning pace.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Collaborative Learning',
    description: 'Join study groups and share resources with peers around the world.',
    icon: UserGroupIcon,
  },
  {
    name: 'Gamified Progress',
    description: 'Track your progress and earn rewards as you achieve your study goals.',
    icon: TrophyIcon,
  },
];

export default function Features() {
  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Study Smarter</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to excel in your studies
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines cutting-edge technology with proven study methods to help you achieve your academic goals.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
