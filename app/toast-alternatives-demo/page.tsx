"use client";

import { useState } from "react";
import { X, Filter, AlertCircle } from "lucide-react";

/**
 * Demo page showing accessible alternatives to toast notifications
 * Based on Primer accessibility guidelines: https://primer.style/accessibility/toasts/
 *
 * This page demonstrates 3 different approaches for showing filter status:
 * 1. Inline Filter Badge (Persistent badge above content)
 * 2. Filter Status Bar (Sticky header with clear visual hierarchy)
 * 3. Inline Alert Banner (Traditional alert style with ARIA live region)
 */
export default function ToastAlternativesDemo() {
  const [option1Active, setOption1Active] = useState(false);
  const [option2Active, setOption2Active] = useState(false);
  const [option3Active, setOption3Active] = useState(false);

  const mockResultCount: number = 12;
  const mockSearchTerm = "House Music";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Toast Notification Alternatives
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Accessible alternatives to toast notifications for filter status
            display. Based on{" "}
            <a
              href="https://primer.style/accessibility/toasts/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Primer Accessibility Guidelines
            </a>
          </p>
        </div>

        {/* Why Toast Notifications Are Problematic */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            ❌ Why Toast Notifications Are Problematic
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              • <strong>Not perceivable by all users:</strong> Auto-dismiss
              makes them easy to miss
            </li>
            <li>
              • <strong>No keyboard/focus management:</strong> Cannot be
              navigated or interacted with easily
            </li>
            <li>
              • <strong>Lack of persistence:</strong> Users can&apos;t revisit
              the information
            </li>
            <li>
              • <strong>Disruptive placement:</strong> Overlays may cover
              important content
            </li>
            <li>
              • <strong>Screen reader issues:</strong> May not be announced or
              announced too late
            </li>
          </ul>
        </section>

        {/* Option 1: Inline Filter Badge */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Option 1: Inline Filter Badge
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                A persistent badge that appears inline with the content,
                providing clear visual feedback without overlaying the UI.
              </p>
            </div>
            <button
              onClick={() => setOption1Active(!option1Active)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {option1Active ? "Clear Filter" : "Apply Filter"}
            </button>
          </div>

          {/* Demo Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 min-h-[200px]">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              EVENT LISTING AREA
            </h3>

            {/* Filter Badge - Option 1 */}
            {option1Active && (
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="mb-6 inline-flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  <strong>{mockResultCount} results</strong> for &quot;
                  {mockSearchTerm}&quot;
                </span>
                <button
                  onClick={() => setOption1Active(false)}
                  className="ml-2 p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
                  aria-label="Clear filter"
                >
                  <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400"
                >
                  Event {i}
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Accessibility Features
            </h4>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <li>• Persistent (doesn&apos;t auto-dismiss)</li>
              <li>• In document flow (discoverable by all users)</li>
              <li>• ARIA live region announces filter application</li>
              <li>• Keyboard accessible clear button</li>
              <li>• Clear visual hierarchy</li>
            </ul>
          </div>
        </section>

        {/* Option 2: Filter Status Bar */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Option 2: Filter Status Bar
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                A full-width status bar that appears below the filter controls,
                providing prominent feedback with actionable controls.
              </p>
            </div>
            <button
              onClick={() => setOption2Active(!option2Active)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {option2Active ? "Clear Filter" : "Apply Filter"}
            </button>
          </div>

          {/* Demo Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 min-h-[200px]">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              FILTER CONTROLS AREA
            </h3>

            {/* Mock filter buttons */}
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                All Dates
              </button>
              <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                All Venues
              </button>
              <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                All Artists
              </button>
            </div>

            {/* Filter Status Bar - Option 2 */}
            {option2Active && (
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="mb-4 flex items-center justify-between gap-4 px-4 py-3 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 border-l-4 border-pink-500 dark:border-pink-400 rounded-r-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-500 dark:bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {mockResultCount}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Active Filter
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Showing results for &quot;{mockSearchTerm}&quot;
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOption2Active(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-colors"
                  aria-label="Clear filter and show all events"
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400"
                >
                  Event {i}
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Accessibility Features
            </h4>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <li>• Highly visible and prominent</li>
              <li>• Persistent until user action</li>
              <li>• ARIA live region for screen reader announcements</li>
              <li>• Large, clearly labeled clear button</li>
              <li>• Visual hierarchy with color coding</li>
              <li>• No timing constraints</li>
            </ul>
          </div>
        </section>

        {/* Option 3: Inline Alert Banner */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Option 3: Inline Alert Banner
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                A traditional alert-style banner with icon, message, and action
                button. Familiar pattern that users recognize.
              </p>
            </div>
            <button
              onClick={() => setOption3Active(!option3Active)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {option3Active ? "Clear Filter" : "Apply Filter"}
            </button>
          </div>

          {/* Demo Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 min-h-[200px]">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              EVENT LISTING AREA
            </h3>

            {/* Alert Banner - Option 3 */}
            {option3Active && (
              <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="mb-6 flex items-start gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg shadow-md"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold">Filter Applied</div>
                  <div className="text-sm opacity-90">
                    Showing {mockResultCount}{" "}
                    {mockResultCount === 1 ? "result" : "results"} for &quot;
                    {mockSearchTerm}&quot;
                  </div>
                </div>
                <button
                  onClick={() => setOption3Active(false)}
                  className="flex-shrink-0 p-1.5 hover:bg-blue-700 rounded-lg transition-colors"
                  aria-label="Clear filter and show all events"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400"
                >
                  Event {i}
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Accessibility Features
            </h4>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <li>
                • Uses role=&quot;alert&quot; for immediate screen reader
                announcement
              </li>
              <li>• Persistent and in document flow</li>
              <li>• High contrast and visually prominent</li>
              <li>• Clear iconography</li>
              <li>• Keyboard accessible dismiss button</li>
              <li>• Familiar alert pattern</li>
            </ul>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Feature
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Option 1: Badge
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Option 2: Status Bar
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    Option 3: Alert
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">Visual Prominence</td>
                  <td className="text-center py-3 px-4">⭐⭐⭐</td>
                  <td className="text-center py-3 px-4">⭐⭐⭐⭐⭐</td>
                  <td className="text-center py-3 px-4">⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">Space Efficiency</td>
                  <td className="text-center py-3 px-4">⭐⭐⭐⭐⭐</td>
                  <td className="text-center py-3 px-4">⭐⭐⭐</td>
                  <td className="text-center py-3 px-4">⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">Clear Action Button</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅ (Large)</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">ARIA Announcements</td>
                  <td className="text-center py-3 px-4">
                    role=&quot;status&quot;
                  </td>
                  <td className="text-center py-3 px-4">
                    role=&quot;status&quot;
                  </td>
                  <td className="text-center py-3 px-4">
                    role=&quot;alert&quot;
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">Best Use Case</td>
                  <td className="py-3 px-4">Subtle, inline</td>
                  <td className="py-3 px-4">Prominent, action-focused</td>
                  <td className="py-3 px-4">Important notifications</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Recommendation */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border-2 border-green-300 dark:border-green-700">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            💡 Recommendation for GrooveRooster
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Option 2: Filter Status Bar</strong> is recommended
              because:
            </p>
            <ul className="space-y-2 ml-6">
              <li>
                ✅ <strong>Highly visible:</strong> Users immediately see that a
                filter is active
              </li>
              <li>
                ✅ <strong>Clear action:</strong> Large &quot;Clear Filter&quot;
                button is easy to find and use
              </li>
              <li>
                ✅ <strong>Contextual placement:</strong> Appears below filter
                controls where users expect feedback
              </li>
              <li>
                ✅ <strong>Accessible:</strong> ARIA live region + persistent
                display + keyboard navigation
              </li>
              <li>
                ✅ <strong>Scalable:</strong> Can show multiple filters or
                additional information if needed
              </li>
            </ul>
            <p className="mt-4 font-semibold">
              This approach aligns with Primer&apos;s recommendation for
              persistent, in-flow feedback that doesn&apos;t rely on overlays or
              temporary notifications.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
