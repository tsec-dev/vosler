// app/api/announcements/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    if (!classId) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }

    // Query announcements for the specific class
    const { data, error } = await supabase
      .from('class_announcements')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })
      .limit(5); // Only get the 5 most recent announcements

    if (error) {
      console.error('Error fetching announcements:', error);
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('isAdmin');
    
    // Only allow admins to post announcements
    if (isAdmin !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const requestBody = await request.json();
    const { classId, title, content } = requestBody;
    
    if (!classId || !title || !content) {
      return NextResponse.json({ error: 'Class ID, title, and content are required' }, { status: 400 });
    }
    
    // Insert new announcement
    const { data, error } = await supabase
      .from('class_announcements')
      .insert([
        { 
          class_id: classId, 
          title, 
          content,
          created_at: new Date().toISOString()
        }
      ])
      .select();
      
    if (error) {
      console.error('Error creating announcement:', error);
      return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
    }
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}