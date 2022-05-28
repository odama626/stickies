import wretch from 'wretch';

interface SendEmailArgs {
  email: string;
  data: {
    subject?: string;
    message?: string;
    url?: string;
    urlText?: string;
  }
}

export default function sendEmail({ email, data }) {
  return wretch(process.env.SENDGRID_API_URL)
    .headers({
      'Cotent-Type': 'application/json',
      Authorization: `Bearer ${process.env.SENDGRID_API_TOKEN}`,
    })
    .post({
      personalizations: [{ to: [{ email }], dynamic_template_data: data }],
      from: { email: 'accounts@stickies.com', name: 'Stickies Account' },
      template_id: process.env.SENDGRID_MAGIC_LINK_TEMPLATE,
    });
}
