import React from 'react';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
    <div className="text-gray-400 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const AccessibilityStatementPage = () => (
  <main className="min-h-screen bg-dark-950 py-16 px-4">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Accessibility Statement</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: January 1, 2026</p>

      <Section title="Our Commitment">
        <p>SceneIQ is built with accessibility at its core. Our mission is to empower visually impaired users to understand any scene through AI-powered descriptions, object detection, and spoken audio. We are committed to ensuring the platform is usable by everyone.</p>
      </Section>

      <Section title="Conformance Status">
        <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with disabilities.</p>
      </Section>

      <Section title="Accessibility Features">
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>All interactive elements include ARIA labels for screen reader compatibility</li>
          <li>Keyboard navigation is supported throughout the application</li>
          <li>High contrast mode available in your profile settings</li>
          <li>Adjustable text-to-speech rate for audio descriptions</li>
          <li>Images are described using AI-generated captions read aloud via the Web Speech API</li>
          <li>Focus indicators are visible on all interactive elements</li>
          <li>Color is not used as the sole means of conveying information</li>
        </ul>
      </Section>

      <Section title="Known Limitations">
        <p>We are continuously working to improve accessibility. Current known limitations include:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Webcam capture may not be fully accessible on all assistive technologies</li>
          <li>AI-generated descriptions may occasionally be imprecise</li>
        </ul>
      </Section>

      <Section title="Feedback and Contact">
        <p>We welcome your feedback on the accessibility of SceneIQ. If you experience any barriers or have suggestions for improvement, please contact us at <a href="mailto:support@sceneiq.com" className="text-cyan-400 hover:underline">support@sceneiq.com</a>.</p>
        <p>We aim to respond to accessibility feedback within 2 business days.</p>
      </Section>
    </div>
  </main>
);

export default AccessibilityStatementPage;
