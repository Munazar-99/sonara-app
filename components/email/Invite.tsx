import React from 'react';

interface InvitationEmailProps {
  email: string;
  name?: string;
  createPasswordLink?: string;
}

const InvitationEmail = ({
  email,
  name,
  createPasswordLink,
}: InvitationEmailProps) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>You&apos;re invited</title>
      </head>
      <body
        style={{
          backgroundColor: '#f6f9fc',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.5',
          margin: 0,
          padding: 0,
          WebkitTextSizeAdjust: '100%',
        }}
      >
        <table
          cellPadding="0"
          cellSpacing="0"
          border={0}
          width="100%"
          style={{ minWidth: '100%', backgroundColor: '#f6f9fc' }}
        >
          <tr>
            <td align="center" valign="top">
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
                style={{
                  maxWidth: '600px',
                  margin: '0 auto',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08)',
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      padding: '40px 30px',
                      backgroundColor: '#4F46E5',
                      textAlign: 'center',
                    }}
                  >
                    <h1
                      style={{
                        color: '#ffffff',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        margin: '0',
                      }}
                    >
                      You&apos;re Invited
                    </h1>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: '30px' }}>
                    <p style={{ marginBottom: '20px', color: '#333333' }}>
                      Hello {name ? name : 'there'},
                    </p>

                    <p style={{ marginBottom: '20px', color: '#333333' }}>
                      You&apos;ve been invited to join our platform using this
                      email address:
                    </p>

                    <p
                      style={{
                        marginBottom: '20px',
                        fontWeight: 'bold',
                        color: '#111827',
                      }}
                    >
                      {email}
                    </p>

                    <p style={{ marginBottom: '20px', color: '#333333' }}>
                      To get started, please set your password and activate your
                      account.
                    </p>

                    {createPasswordLink && (
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                      >
                        <tr>
                          <td align="center">
                            <a
                              href={createPasswordLink}
                              style={{
                                backgroundColor: '#4F46E5',
                                border: '1px solid #4F46E5',
                                borderRadius: '4px',
                                color: '#ffffff',
                                display: 'inline-block',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                padding: '12px 24px',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                              }}
                            >
                              Create Password
                            </a>
                          </td>
                        </tr>
                      </table>
                    )}

                    {!createPasswordLink && (
                      <p style={{ marginBottom: '20px', color: '#333333' }}>
                        Your activation link will be sent shortly. Please keep
                        an eye on your inbox.
                      </p>
                    )}

                    <p style={{ marginTop: '20px', color: '#333333' }}>
                      This invitation link will expire for security reasons.
                    </p>

                    <p style={{ marginTop: '20px', color: '#333333' }}>
                      If you weren&apos;t expecting this invitation, you can
                      safely ignore this email.
                    </p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      backgroundColor: '#f6f9fc',
                      padding: '20px',
                      textAlign: 'center',
                      color: '#666666',
                      fontSize: '12px',
                    }}
                  >
                    <p style={{ margin: '0' }}>
                      This is an automated message, please do not reply.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

export default InvitationEmail;
