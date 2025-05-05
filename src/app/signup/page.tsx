'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import AuthLayout from '@/components/auth/AuthLayout';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        institution: formData.get('institution'),
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Something went wrong');
      }

      // Redirect to login page on success
      window.location.href = '/login?registered=true';
    } catch (error) {
      console.error('Registration error:', error);
      alert(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your learning journey today"
    >
      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="First name"
              type="text"
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              required
            />
            <Input
              label="Last name"
              type="text"
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              required
            />
          </div>

          <Input
            label="Email address"
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
            helpText="Must be at least 8 characters long"
          />

          <Input
            label="School/Institution"
            type="text"
            id="institution"
            name="institution"
            autoComplete="organization"
            helpText="Optional"
          />

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create account
          </Button>
        </form>
      </Card>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
