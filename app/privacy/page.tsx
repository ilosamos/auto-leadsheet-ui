export default function PrivacyPage() {
  return (
    <main
      className="standalone-page"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "3rem 1.5rem 4rem",
        lineHeight: 1.6,
      }}
    >
      <a
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        &larr; Go back
      </a>
      <h1>Privacy Policy for leadsheet.me</h1>
      <p>
        <strong>Effective date:</strong> 2026-02-12
        <br />
        <strong>Last updated:</strong> 2026-02-12
      </p>
      <p>
        This Privacy Policy explains how <strong>leadsheet.me</strong> (the “
        <strong>Service</strong>”) collects, uses, shares, and protects personal
        data. By using the Service, you acknowledge this Privacy Policy.
      </p>

      <h2>1. Controller / Who we are</h2>
      <p>
        The Service is operated by <strong>Daniel Berger</strong>, a private
        individual, based in <strong>Austria</strong> (“we”, “us”, “our”). We act
        as the <strong>data controller</strong> for personal data processed
        through the Service.
      </p>
      <p>
        <strong>Contact for privacy requests:</strong> office@leadsheet-app.com
      </p>

      <h2>2. What data we collect</h2>
      <h3>2.1 Account and identity data (Google Sign-In)</h3>
      <p>
        We use <strong>Google Sign-In</strong> for authentication. The Google
        Sign-In scope is limited to the <strong>minimum necessary</strong>{" "}
        information:
      </p>
      <ul>
        <li>
          <strong>Name</strong>
        </li>
        <li>
          <strong>Email address</strong>
        </li>
      </ul>
      <p>
        We store this data to create and maintain your user account and to
        authorize access to the Service.
      </p>

      <h3>2.2 Content you upload</h3>
      <p>
        When you use the Service, you may upload audio files (“
        <strong>Uploads</strong>”) for analysis and lead sheet generation. We
        process and store:
      </p>
      <ul>
        <li>
          <strong>Audio files you upload</strong>
        </li>
        <li>
          <strong>Generated outputs</strong> (e.g., PDF and MusicXML files)
        </li>
      </ul>

      <h3>2.3 Payment-related data (Stripe)</h3>
      <p>
        Payments are processed by <strong>Stripe</strong>. We do not store full
        payment card details. Depending on Stripe’s setup and the information
        sent back to us, we may receive and store limited payment metadata such
        as:
      </p>
      <ul>
        <li>purchase status (successful/failed)</li>
        <li>amount, currency</li>
        <li>credit pack purchased (e.g., 5 or 10 credits)</li>
        <li>timestamps and transaction identifiers (as provided by Stripe)</li>
      </ul>

      <h3>2.4 Usage and technical data</h3>
      <p>
        Like most online services, we may process basic technical data necessary
        for operation and security, such as:
      </p>
      <ul>
        <li>device/browser information</li>
        <li>IP address (typically via server logs)</li>
        <li>timestamps, basic request logs</li>
        <li>error/diagnostic information</li>
      </ul>
      <p>
        This data is used for security, troubleshooting, and maintaining the
        Service.
      </p>

      <h2>3. Why we use your data (purposes)</h2>
      <p>We process personal data for the following purposes:</p>
      <ul>
        <li>
          <strong>Authentication and account access</strong> (name/email from
          Google Sign-In)
        </li>
        <li>
          <strong>Providing the Service</strong>: uploading, storing, processing
          audio files; generating lead sheets and delivering PDF/MusicXML outputs
        </li>
        <li>
          <strong>Payments and billing support</strong>: handling purchases and
          confirming credits via Stripe
        </li>
        <li>
          <strong>Security and abuse prevention</strong>
        </li>
        <li>
          <strong>Customer support</strong>: responding to questions and
          deletion requests
        </li>
        <li>
          <strong>Service maintenance and improvement</strong> (e.g., debugging,
          performance monitoring)
        </li>
      </ul>

      <h2>4. Legal bases (GDPR)</h2>
      <p>Where the GDPR applies, our legal bases include:</p>
      <ul>
        <li>
          <strong>Contract performance</strong> (Art. 6(1)(b) GDPR): to provide
          the Service you request (account access, file processing, output
          generation, credit usage)
        </li>
        <li>
          <strong>Legitimate interests</strong> (Art. 6(1)(f) GDPR): operating,
          securing, and improving the Service; preventing fraud/abuse;
          maintaining logs necessary for reliability and security
        </li>
        <li>
          <strong>Legal obligation</strong> (Art. 6(1)(c) GDPR): where we must
          comply with applicable laws (e.g., accounting/record-keeping
          requirements for payments)
        </li>
      </ul>

      <h2>5. How long we keep data (retention)</h2>
      <p>We keep data only as long as necessary for the purposes described above:</p>
      <ul>
        <li>
          <strong>Account data (name/email):</strong> retained while you
          maintain an account, and for a reasonable period thereafter if needed
          for security, dispute handling, or compliance.
        </li>
        <li>
          <strong>Uploaded audio files and generated outputs:</strong> stored{" "}
          <strong>for a while</strong> to enable processing and to provide you
          the requested lead sheets. We may also keep them for a limited time
          after generation for reliability (e.g., re-download), unless you
          request deletion.
        </li>
        <li>
          <strong>Payment metadata:</strong> retained as needed for accounting,
          fraud prevention, and legal compliance.
        </li>
        <li>
          <strong>Logs/technical data:</strong> retained for a limited time for
          security and troubleshooting.
        </li>
      </ul>
      <p>You can request deletion as described in Section 9.</p>

      <h2>6. Where data is stored</h2>
      <p>
        Data is stored in a <strong>database</strong> and associated storage used
        to run the Service. We take reasonable steps to protect stored data
        using appropriate technical and organizational measures (see Section
        10).
      </p>

      <h2>7. Sharing and third parties</h2>
      <p>We share data only as needed to operate the Service:</p>

      <h3>7.1 Google Sign-In (authentication)</h3>
      <p>
        We use Google Sign-In to authenticate you. Google processes data
        according to its own privacy policies.
      </p>

      <h3>7.2 Stripe (payments)</h3>
      <p>
        We use Stripe to process payments. Stripe processes payment information
        according to its own privacy policies and security standards.
      </p>

      <h3>7.3 Service providers / hosting</h3>
      <p>
        We may use infrastructure providers (e.g., hosting, storage, database)
        to run leadsheet.me. They process data only on our instructions and to
        provide their services to us.
      </p>

      <h3>7.4 Legal and safety</h3>
      <p>We may disclose information if we believe it is reasonably necessary to:</p>
      <ul>
        <li>comply with a legal obligation or request,</li>
        <li>enforce our terms, or</li>
        <li>
          protect the rights, safety, and security of users, the public, or the
          Service.
        </li>
      </ul>

      <h2>8. International transfers</h2>
      <p>
        If any of our providers (e.g., Google, Stripe, infrastructure vendors)
        process data outside the European Economic Area (EEA), transfers may
        occur under appropriate safeguards (such as adequacy decisions or
        standard contractual clauses), depending on the provider’s setup.
      </p>

      <h2>9. Your rights and choices</h2>
      <h3>9.1 Access, deletion, and other GDPR rights</h3>
      <p>
        Depending on your location (and particularly if you are in the
        EEA/UK), you may have rights including:
      </p>
      <ul>
        <li>access to your personal data</li>
        <li>correction of inaccurate data</li>
        <li>deletion of your data</li>
        <li>restriction or objection to certain processing</li>
        <li>data portability (where applicable)</li>
        <li>the right to lodge a complaint with a supervisory authority</li>
      </ul>

      <h3>9.2 Requesting deletion</h3>
      <p>
        You may request deletion of your data by emailing:
        <br />
        <strong>office@leadsheet-app.com</strong>
      </p>
      <p>
        Please include the email address you use to sign in (Google account
        email) so we can locate your account.
      </p>

      <h2>10. Security</h2>
      <p>
        We use reasonable technical and organizational measures designed to
        protect personal data against unauthorized access, loss, misuse,
        alteration, or destruction. No method of transmission or storage is
        100% secure, so we cannot guarantee absolute security.
      </p>

      <h2>11. Children’s privacy</h2>
      <p>
        The Service is not intended for children. If you believe a child has
        provided personal data, contact us at{" "}
        <strong>office@leadsheet-app.com</strong>.
      </p>

      <h2>12. Changes to this Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The “Last updated”
        date will reflect the latest changes. Continued use of the Service after
        an update means you accept the updated Privacy Policy.
      </p>

      <h2>13. Contact</h2>
      <p>For privacy questions or requests:</p>
      <p>
        <strong>Email:</strong> office@leadsheet-app.com
        <br />
        <strong>Operator:</strong> Daniel Berger (Austria)
      </p>

      <hr />

      <h2>Plain-language summary (not legally binding)</h2>
      <ul>
        <li>
          We store your <strong>name and email</strong> from Google Sign-In to
          let you log in.
        </li>
        <li>
          We store your <strong>uploaded audio files</strong> temporarily to
          generate lead sheets and deliver <strong>PDF/MusicXML</strong> outputs.
        </li>
        <li>
          <strong>Stripe</strong> handles payments; we keep only basic purchase
          records.
        </li>
        <li>
          You can request deletion anytime via{" "}
          <strong>office@leadsheet-app.com</strong>.
        </li>
      </ul>
    </main>
  );
}
