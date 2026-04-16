import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = createClient();
    const newPassword = "myaccess2026";

    // List all users
    const { data: users, error: listError } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const user of users.users) {
      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

      if (error) {
        failed++;
        errors.push(`${user.email}: ${error.message}`);
      } else {
        updated++;
      }
    }

    return NextResponse.json({
      success: true,
      total: users.users.length,
      updated,
      failed,
      errors: errors.slice(0, 10),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
