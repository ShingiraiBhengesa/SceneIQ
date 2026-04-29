import React from 'react';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
    <div className="text-gray-400 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicyPage = () => (
  <main className="min-h-screen bg-dark-950 py-16 px-4">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Effective date: January 1, 2026</p>

      <Section title="1. Information We Collect">
        <p>We collect information you provide directly to us when you create an account, including your name and email address.</p>
        <p>When you use the image analysis feature, we temporarily process the images you upload. Images are used solely to generate descriptions and object detection results and are not stored permanently beyond the session unless explicitly saved to your history.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Provide, maintain, and improve SceneIQ services</li>
          <li>Authenticate your account and keep it secure</li>
          <li>Store your analysis history so you can review past results</li>
          <li>Respect your accessibility preferences (speech rate, high contrast mode)</li>
        </ul>
      </Section>

      <Section title="3. Third-Party Services">
        <p>SceneIQ uses the Groq API to process images for AI-powered descriptions and object detection. Images sent for analysis are transmitted to Groq's servers. Please refer to Groq's privacy policy for details on how they handle data.</p>
      </Section>

      <Section title="4. Data Retention">
        <p>Your account data is retained for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at support@sceneiq.com.</p>
      </Section>

      <Section title="5. Security">
        <p>We take reasonable measures to protect your information, including hashing passwords with bcrypt and using secure JWT-based authentication. However, no method of transmission over the Internet is 100% secure.</p>
      </Section>

      <Section title="6. Contact Us">
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@sceneiq.com" className="text-cyan-400 hover:underline">support@sceneiq.com</a>.</p>
      </Section>
    </div>
  </main>
);

export default PrivacyPolicyPage;
