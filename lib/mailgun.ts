import type { Order, OrderItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export async function sendOrderConfirmation(args: {
  to: string;
  customerName: string;
  order: Order;
  items: OrderItem[];
}) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const from = process.env.MAILGUN_FROM ?? "MediCare <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[mail] MAILGUN_API_KEY missing — skipping email send.");
    return { skipped: true };
  }

  const itemsHtml = args.items
    .map(
      (it) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">${escape(it.product_name)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${it.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatPrice(
            it.unit_price_cents * it.quantity,
          )}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
      <h1 style="margin:0 0 8px">Thanks for your order, ${escape(args.customerName)}</h1>
      <p style="color:#64748b;margin:0 0 24px">
        Order <strong>#${args.order.id.slice(0, 8)}</strong> — we received it and will ship shortly.
      </p>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th style="text-align:left;padding-bottom:8px">Item</th>
            <th style="text-align:center;padding-bottom:8px">Qty</th>
            <th style="text-align:right;padding-bottom:8px">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding-top:12px;text-align:right"><strong>Total</strong></td>
            <td style="padding-top:12px;text-align:right"><strong>${formatPrice(
              args.order.total_cents,
            )}</strong></td>
          </tr>
        </tfoot>
      </table>
      <p style="margin-top:24px;color:#94a3b8;font-size:12px">
        Shipping to: ${escape(args.order.shipping_address)}, ${escape(args.order.shipping_postcode)}, ${escape(args.order.shipping_country)}
      </p>
    </div>
  `;

  const text = `Thanks for your order, ${args.customerName}!

Order #${args.order.id.slice(0, 8)}
Total: ${formatPrice(args.order.total_cents)}

Items:
${args.items.map((it) => `- ${it.product_name} x${it.quantity} — ${formatPrice(it.unit_price_cents * it.quantity)}`).join("\n")}

Shipping to: ${args.order.shipping_address}, ${args.order.shipping_postcode}, ${args.order.shipping_country}
`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [args.to],
      subject: `Order confirmation — #${args.order.id.slice(0, 8)}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mail provider error ${res.status}: ${body}`);
  }
  return await res.json();
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}
