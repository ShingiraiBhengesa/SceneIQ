import React from 'react';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
    <div className="text-gray-400 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const TermsOfServicePage = () => (
  <main className="min-h-screen bg-dark-950 py-16 px-4">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-10">Effective date: January 1, 2026</p>

      <Section title="1. Acceptance of Terms">
        <p>By accessing or using SceneIQ, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
      </Section>

      <Section title="2. Use of the Service">
        <p>SceneIQ is an AI-powered visual accessibility tool. You agree to use it only for lawful purposes. You must not:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Upload images containing illegal or harmful content</li>
          <li>Attempt to reverse-engineer or misuse the platform</li>
          <li>Use the service to infringe on the rights of others</li>
          <li>Share your account credentials with others</li>
        </ul>
      </Section>

      <Section title="3. Account Responsibility">
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at support@sceneiq.com if you suspect unauthorized access.</p>
      </Section>

      <Section title="4. Intellectual Property">
        <p>All content, logos, and technology associated with SceneIQ are the property of the SceneIQ team. You retain ownership of images you upload, but grant us a limited license to process them for the purpose of providing the service.</p>
      </Section>

      <Section title="5. Disclaimer of Warranties">
        <p>SceneIQ is provided "as is" without warranties of any kind. AI-generated descriptions and object detection results may not always be accurate. Do not rely solely on SceneIQ output for critical decisions.</p>
      </Section>

      <Section title="6. Limitation of Liability">
        <p>To the fullest extent permitted by law, SceneIQ shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
      </Section>

      <Section title="7. Changes to Terms">
        <p>We reserve the right to update these terms at any time. Continued use of the service after changes are posted constitutes acceptance of the new terms.</p>
      </Section>

      <Section title="8. Contact">
        <p>For questions about these Terms, contact us at <a href="mailto:support@sceneiq.com" className="text-cyan-400 hover:underline">support@sceneiq.com</a>.</p>
      </Section>
    </div>
  </main>
);

export default TermsOfServicePage;
