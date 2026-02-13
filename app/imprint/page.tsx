import Link from "next/link";

export default function ImprintPage() {
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
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        &larr; Go back
      </Link>
      <h1>Imprint / Impressum</h1>
      <p>
        <strong>Website:</strong> leadsheet.me
        <br />
        <strong>Operator / Diensteanbieter (Medieninhaber &amp; Herausgeber):</strong>{" "}
        Daniel Berger (private individual)
        <br />
        <strong>Country:</strong> Austria
      </p>

      <h2>Contact</h2>
      <p>
        <strong>Email:</strong> office@leadsheet-app.com
      </p>

      <h2>Address</h2>
      <p>
        <strong>Geographic address (Anschrift):</strong>
        <br />
        <em>
          Please insert your full address here (street, postal code, city,
          Austria).
        </em>
      </p>

      <h2>Business purpose (Unternehmensgegenstand)</h2>
      <p>
        Operation of an online application for AI-assisted analysis of
        user-provided audio files and generation of draft lead sheets
        (PDF/MusicXML).
      </p>

      <h2>Editorial line / “Blattlinie” (basic disclosure)</h2>
      <p>
        Information and provision of tools related to music lead sheet
        generation and product/service updates for leadsheet.me.
      </p>

      <h2>Third-party services</h2>
      <ul>
        <li>Authentication: Google Sign-In</li>
        <li>Payments: Stripe</li>
      </ul>

      <h2>Notes (only if applicable)</h2>
      <ul>
        <li>
          <strong>VAT ID (UID):</strong> (if you have one, add it here)
        </li>
        <li>
          <strong>Company register / Firmenbuch number &amp; court:</strong>{" "}
          (only if applicable)
        </li>
        <li>
          <strong>
            Supervisory authority / Gewerbebehörde &amp; applicable professional
            rules:
          </strong>{" "}
          (only if applicable)
        </li>
      </ul>
    </main>
  );
}
