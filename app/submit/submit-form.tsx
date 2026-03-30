'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitTool } from './actions';
import Link from 'next/link';
import type { Category } from '@/lib/db/schema';

interface SubmitToolFormProps {
  categories: Category[];
}

export function SubmitToolForm({ categories }: SubmitToolFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setResult(null);
    
    const response = await submitTool(formData);
    setResult(response);
    setIsSubmitting(false);
  }

  if (result?.success) {
    return (
      <div className="text-center py-8">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Submission Received!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for submitting your tool. We&apos;ll review it and get back to you soon.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/tools" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse Tools
          </Link>
          <button
            onClick={() => setResult(null)}
            className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {result && !result.success && (
        <div className="rounded-md bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{result.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Tool Name <span className="text-red-500">*</span>
        </label>
        <input 
          id="name"
          name="name"
          type="text" 
          required
          minLength={2}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="e.g., CodeWizard AI"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-sm font-medium mb-2">
          Website URL <span className="text-red-500">*</span>
        </label>
        <input 
          id="websiteUrl"
          name="websiteUrl"
          type="url" 
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="https://..."
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select 
          id="categoryId"
          name="categoryId"
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea 
          id="description"
          name="description"
          required
          minLength={20}
          rows={4}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="What does your tool do? Who is it for?"
        />
        <p className="text-xs text-muted-foreground mt-1">Minimum 20 characters</p>
      </div>

      <div>
        <label htmlFor="pricingModel" className="block text-sm font-medium mb-2">
          Pricing Model <span className="text-red-500">*</span>
        </label>
        <select 
          id="pricingModel"
          name="pricingModel"
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Select pricing</option>
          <option value="free">Free</option>
          <option value="freemium">Freemium</option>
          <option value="paid">Paid</option>
          <option value="open_source">Open Source</option>
        </select>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Your Email <span className="text-red-500">*</span>
        </label>
        <input 
          id="email"
          name="email"
          type="email" 
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="you@example.com"
        />
        <p className="text-xs text-muted-foreground mt-1">We&apos;ll notify you when your tool is approved</p>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Submit Tool
          </>
        )}
      </button>
    </form>
  );
}
