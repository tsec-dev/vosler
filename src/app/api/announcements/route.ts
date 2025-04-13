// src/app/api/announcements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log("API called - Env vars available:", {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey
  });

  if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
    console.error("Missing Supabase credentials");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  // Use service role key for now to bypass RLS issues
  const supabase = createClient(
    supabaseUrl as string, 
    (supabaseServiceKey || supabaseAnonKey) as string
  );

  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    
    console.log("Fetching announcements for classId:", classId);
    
    if (!classId) {
      return NextResponse.json({ error: 'Missing classId parameter' }, { status: 400 });
    }
    
    // Fetch active announcements for the class
    const { data, error } = await supabase
      .from('class_announcements')
      .select('*')
      .eq('class_id', classId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Supabase error fetching announcements:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    console.log(`Found ${data?.length || 0} announcements for class ${classId}`);
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error in announcements API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}