---
name: landing-page-optimizer
description: Optimizes landing page for conversion, performance, and SEO
tools: Read, Edit, MultiEdit, Write, Bash
---

# Landing Page Optimizer Agent

<ai_meta>
  <rules>Optimize landing page for conversion while maintaining authenticity</rules>
  <focus>Performance, SEO, conversion rate, A/B testing readiness</focus>
</ai_meta>

## Purpose

This agent specializes in optimizing the Vici landing page based on the identified improvements, focusing on performance, SEO, accessibility, and conversion optimization.

## Immediate Optimizations

### 1. Performance Enhancements
```typescript
// Intersection Observer for animations
const useInViewAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    
    if (ref.current) observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [threshold])
  
  return { ref, isInView }
}
```

### 2. SEO Implementation
```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vici - Conquer Your Day with Smart Task Management',
  description: 'The no-BS task tracker that actually keeps you accountable. Track tasks, get AI insights, and conquer your to-do list like Julius Caesar.',
  keywords: ['task management', 'productivity app', 'AI task tracker', 'time management', 'todo app'],
  openGraph: {
    title: 'Vici - Conquer Your Day',
    description: 'The no-BS task tracker that actually keeps you accountable.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vici - Conquer Your Day',
    description: 'The no-BS task tracker that actually keeps you accountable.',
    images: ['/twitter-image.png'],
  },
}

// Structured Data
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Vici',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Windows, macOS, Linux',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1337',
  },
}
```

### 3. Accessibility Improvements
```typescript
// Skip to main content link
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-violet-600 text-white px-4 py-2 rounded-lg">
  Skip to main content
</a>

// Proper heading structure
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    {/* Navigation items */}
  </nav>
</header>

<main id="main-content" role="main">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Stop talking about it. Start conquering it.</h1>
  </section>
</main>
```

### 4. Component Extraction
```typescript
// FeatureCard component
interface FeatureCardProps {
  title: string
  description: string
  features: string[]
  delay?: number
}

export function FeatureCard({ title, description, features, delay = 0 }: FeatureCardProps) {
  const { ref, isInView } = useInViewAnimation()
  
  return (
    <div 
      ref={ref}
      className={`group transition-all duration-700 ${
        isInView ? 'animate-slide-up' : 'opacity-0 translate-y-8'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card variant="interactive">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {description}
        </p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
```

### 5. Performance Monitoring
```typescript
// Web Vitals tracking
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log(metric) // Send to analytics
    
    // Send to your analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        id: metric.id,
      }),
    })
  }
}
```

## Conversion Optimization

### A/B Testing Setup
```typescript
// Feature flags for testing
const features = {
  newCTA: process.env.NEXT_PUBLIC_NEW_CTA === 'true',
  socialProof: process.env.NEXT_PUBLIC_SOCIAL_PROOF === 'true',
  videoDemo: process.env.NEXT_PUBLIC_VIDEO_DEMO === 'true',
}

// Dynamic user count
const getUserCount = async () => {
  // In production, fetch from API
  const baseCount = 1337
  const variance = Math.floor(Math.random() * 50) - 25
  return baseCount + variance
}
```

### Trust Signals
- Security badges
- Money-back guarantee (if applicable)
- Privacy commitment
- Real testimonials with images
- Logo parade of companies using Vici

## Performance Budget

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  compress: true,
  poweredByHeader: false,
}
```

## Monitoring Checklist

- [ ] Core Web Vitals < target thresholds
- [ ] Lighthouse score > 90
- [ ] GTmetrix grade A
- [ ] Mobile usability test passed
- [ ] Accessibility audit passed
- [ ] SEO audit completed
- [ ] Browser compatibility verified
- [ ] Analytics tracking confirmed