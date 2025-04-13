// src/app/api/admin/announcements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { getAuth, clerkClient } from "@clerk/nextjs/server";

// Create a supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Clerk user data
    const clerk = await clerkClient();
    const userData = await clerk.users.getUser(userId);
    const email = userData.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    // Parse request body
    const { classId, title, content } = await req.json();
    
    if (!classId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Check if user is admin in the instructors table
    const { data: instructor, error: instructorError } = await supabaseAdmin
      .from('instructors')
      .select('is_admin')
      .eq('email', email)
      .single();
      
    if (instructorError) {
      console.error('Error checking admin status:', instructorError);
      return NextResponse.json(
        { error: 'Failed to verify admin status' }, 
        { status: 500 }
      );
    }
      
    if (!instructor?.is_admin) {
      return NextResponse.json(
        { error: 'Not authorized to create announcements' }, 
        { status: 403 }
      );
    }
    
    // Insert the announcement using admin privileges
    const { data, error } = await supabaseAdmin
      .from('class_announcements')
      .insert([
        {
          class_id: classId,
          title,
          content,
          created_by: email,
          created_at: new Date().toISOString(),
          is_active: true
        }
      ])
      .select();
      
    if (error) {
      console.error('Error creating announcement:', error);
      return NextResponse.json(
        { error: 'Failed to create announcement: ' + error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Server error: ' + (error instanceof Error ? error.message : 'Unknown error') }, 
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    
    if (!classId) {
      return NextResponse.json(
        { error: 'Missing classId parameter' }, 
        { status: 400 }
      );
    }
    
    // Fetch announcements using admin privileges
    const { data, error } = await supabaseAdmin
      .from('class_announcements')
      .select('*')
      .eq('class_id', classId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching announcements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch announcements' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Server error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Clerk user data
    const clerk = await clerkClient();
    const userData = await clerk.users.getUser(userId);
    const email = userData.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' }, 
        { status: 400 }
      );
    }
    
    // Check if user is admin in the instructors table
    const { data: instructor, error: instructorError } = await supabaseAdmin
      .from('instructors')
      .select('is_admin')
      .eq('email', email)
      .single();
      
    if (instructorError) {
      console.error('Error checking admin status:', instructorError);
      return NextResponse.json(
        { error: 'Failed to verify admin status' }, 
        { status: 500 }
      );
    }
      
    if (!instructor?.is_admin) {
      return NextResponse.json(
        { error: 'Not authorized to delete announcements' }, 
        { status: 403 }
      );
    }
    
    // Soft delete the announcement using admin privileges
    const { error } = await supabaseAdmin
      .from('class_announcements')
      .update({ is_active: false })
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting announcement:', error);
      return NextResponse.json(
        { error: 'Failed to delete announcement' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Server error' }, 
      { status: 500 }
    );
  }
}