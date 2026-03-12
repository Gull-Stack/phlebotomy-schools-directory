import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = "leads@gullstack.com";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, state_code, school_id } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("leads").insert({
      email,
      name: name || null,
      state_code: state_code || null,
      school_id: school_id || null,
      source: "directory",
    });

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    // Send email notification
    if (SENDGRID_API_KEY) {
      try {
        await sgMail.send({
          to: "bryce@gullstack.com",
          from: { email: FROM_EMAIL, name: "PhlebGuide.com" },
          replyTo: email,
          subject: `New PhlebGuide Lead: ${name || email}${state_code ? ` — ${state_code}` : ""}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #1e3a5f; padding: 20px; text-align: center;">
                <h2 style="color: #00d4ff; margin: 0;">New Lead — PhlebGuide.com</h2>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${name || "Not provided"}</td></tr>
                  <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td></tr>
                  ${state_code ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>State:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${state_code}</td></tr>` : ""}
                  ${school_id ? `<tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>School ID:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${school_id}</td></tr>` : ""}
                </table>
              </div>
              <div style="background: #1a1a1a; padding: 15px; text-align: center;">
                <p style="color: #888; margin: 0; font-size: 12px;">Lead from PhlebGuide.com</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("SendGrid error:", emailErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
