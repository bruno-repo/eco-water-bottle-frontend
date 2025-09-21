'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  memoryUsage?: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      const fidEntries = performance.getEntriesByType('first-input');
      const clsEntries = performance.getEntriesByType('layout-shift');

      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const largestContentfulPaint = lcpEntries[lcpEntries.length - 1]?.startTime || 0;
      const firstInputDelay = fidEntries[0]?.processingStart ? fidEntries[0].processingStart - fidEntries[0].startTime : 0;
      const cumulativeLayoutShift = clsEntries.reduce((sum, entry) => sum + (entry as any).value, 0);

      const performanceMetrics: PerformanceMetrics = {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        firstContentfulPaint,
        largestContentfulPaint,
        firstInputDelay,
        cumulativeLayoutShift,
        memoryUsage: (performance as any).memory?.usedJSHeapSize
      };

      setMetrics(performanceMetrics);

      // Send metrics to analytics (optional)
      if (process.env.NODE_ENV === 'production') {
        // Send to your analytics service
        console.log('Performance metrics:', performanceMetrics);
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Measure Core Web Vitals after a delay
    const timeoutId = setTimeout(measurePerformance, 2000);

    return () => {
      window.removeEventListener('load', measurePerformance);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!metrics || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getScoreColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreText = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'Good';
    if (value <= thresholds.poor) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        {isVisible ? 'Hide' : 'Show'} Performance
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
          <h3 className="font-semibold text-gray-900 mb-3">Performance Metrics</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Load Time:</span>
              <span className={getScoreColor(metrics.loadTime, { good: 2000, poor: 4000 })}>
                {Math.round(metrics.loadTime)}ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">First Contentful Paint:</span>
              <span className={getScoreColor(metrics.firstContentfulPaint, { good: 1800, poor: 3000 })}>
                {Math.round(metrics.firstContentfulPaint)}ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Largest Contentful Paint:</span>
              <span className={getScoreColor(metrics.largestContentfulPaint, { good: 2500, poor: 4000 })}>
                {Math.round(metrics.largestContentfulPaint)}ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">First Input Delay:</span>
              <span className={getScoreColor(metrics.firstInputDelay, { good: 100, poor: 300 })}>
                {Math.round(metrics.firstInputDelay)}ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Cumulative Layout Shift:</span>
              <span className={getScoreColor(metrics.cumulativeLayoutShift, { good: 0.1, poor: 0.25 })}>
                {metrics.cumulativeLayoutShift.toFixed(3)}
              </span>
            </div>
            
            {metrics.memoryUsage && (
              <div className="flex justify-between">
                <span className="text-gray-600">Memory Usage:</span>
                <span className="text-gray-900">
                  {Math.round(metrics.memoryUsage / 1024 / 1024)}MB
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div>LCP: {getScoreText(metrics.largestContentfulPaint, { good: 2500, poor: 4000 })}</div>
              <div>FID: {getScoreText(metrics.firstInputDelay, { good: 100, poor: 300 })}</div>
              <div>CLS: {getScoreText(metrics.cumulativeLayoutShift, { good: 0.1, poor: 0.25 })}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: entry.startTime
          } as PerformanceMetrics));
        }
        
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          setMetrics(prev => ({
            ...prev,
            firstInputDelay: fidEntry.processingStart - fidEntry.startTime
          } as PerformanceMetrics));
        }
        
        if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as any;
          setMetrics(prev => ({
            ...prev,
            cumulativeLayoutShift: (prev?.cumulativeLayoutShift || 0) + clsEntry.value
          } as PerformanceMetrics));
        }
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    return () => observer.disconnect();
  }, []);

  return metrics;
};

// Resource timing analyzer
export const useResourceTiming = () => {
  const [resourceMetrics, setResourceMetrics] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const analyzeResources = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const resourceData = resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: resource.initiatorType,
        startTime: resource.startTime
      }));

      setResourceMetrics(resourceData);
    };

    // Analyze after page load
    if (document.readyState === 'complete') {
      analyzeResources();
    } else {
      window.addEventListener('load', analyzeResources);
    }

    return () => {
      window.removeEventListener('load', analyzeResources);
    };
  }, []);

  return resourceMetrics;
};