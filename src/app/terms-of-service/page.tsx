import React from "react";
import StoreLayout from "../store/StoreLayout";

const TermsOfService = () => (
  <StoreLayout>
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Terms of Service</h1>
      <p className="mb-6">
        <strong>Effective Date:</strong> 22 December 2024
      </p>

      <p className="mb-6">
        Welcome to Kotek! By accessing or using our services, you agree to the
        following terms and conditions. Please read them carefully.
      </p>

      <hr className="border-t border-primary/20 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          1. Acceptance of Terms
        </h2>
        <p>
          By creating an account, accessing, or using our website, you confirm
          that you agree to these Terms of Service and our Privacy Policy. If
          you do not agree, please do not use our services.
        </p>
      </section>

      <hr className="border-t border-primary/20 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          2. User Accounts
        </h2>
        <p className="mb-4">
          To access certain features, you must create an account using an
          authentication method such as Twitter. By doing so, you provide
          consent for us to collect basic information, including:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Email address</li>
          <li>Name</li>
          <li>Profile picture</li>
        </ul>
        <p>
          This information is used to identify you, personalize your experience,
          and provide services efficiently.
        </p>
      </section>

      <hr className="border-t border-primary/20 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          3. Use of Data
        </h2>
        <p className="mb-4">
          We collect and store user data solely for the following purposes:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To authenticate your identity</li>
          <li>To personalize your user experience</li>
          <li>
            To facilitate communication, such as sending order confirmations or
            updates
          </li>
        </ul>
        <p>
          We do not sell or share your data with third parties, except as
          required by law or as necessary to provide our services.
        </p>
      </section>

      <hr className="border-t border-primary/20 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          4. User Responsibilities
        </h2>
        <p className="mb-4">Users agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Provide accurate and up-to-date information during registration.
          </li>
          <li>Keep their account secure and confidential.</li>
          <li>Refrain from using our services for any illegal activities.</li>
        </ul>
      </section>

      <hr className="border-t border-primary/20 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          5. Termination of Account
        </h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these terms or are associated with fraudulent or unlawful activities.
        </p>
      </section>

      <hr className="border-t border-primary/20 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          6. Intellectual Property
        </h2>
        <p>
          All content on our website, including text, images, and logos, is the
          property of Kotek and is protected under applicable laws. Users may
          not use or reproduce this content without explicit permission.
        </p>
      </section>

      <hr className="border-t border-primary/20 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          7. Limitation of Liability
        </h2>
        <p>
          We are not liable for any indirect, incidental, or consequential
          damages arising from the use of our services, including but not
          limited to data breaches, downtime, or third-party actions.
        </p>
      </section>

      <hr className="border-t border-primary/20 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          8. Changes to Terms
        </h2>
        <p>
          We reserve the right to update these Terms of Service at any time.
          Users will be notified of significant changes, and continued use of
          the services constitutes acceptance of the updated terms.
        </p>
      </section>

      <hr className="border-t border-primary/20 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          9. Contact Information
        </h2>
        <p>
          For questions or concerns about these Terms of Service, please contact
          us at{" "}
          <a
            href="mailto:support@kotek.com"
            className="text-primary hover:underline"
          >
            kotek.informatique@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  </StoreLayout>
);

export default TermsOfService;
