import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AsanaClient } from '@/lib/asana';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const client = new AsanaClient(token);
    const user = await client.getMe();
    const workspaces = await client.getWorkspaces();

    if (workspaces.length === 0) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const cookieStore = await cookies();
    
    cookieStore.set('asana_access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    cookieStore.set('asana_user_gid', user.gid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    cookieStore.set('asana_workspace_gid', workspaces[0].gid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    cookieStore.set('asana_user_data', JSON.stringify({
      gid: user.gid,
      name: user.name,
      email: user.email,
    }), {
      httpOnly: false, // Allow client access untuk display
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return NextResponse.json({ 
      success: true,
      user: {
        gid: user.gid,
        name: user.name,
        email: user.email,
      },
      workspace: {
        gid: workspaces[0].gid,
        name: workspaces[0].name,
      }
    });
  } catch (error) {
    console.error('Error setting token:', error);
    return NextResponse.json(
      { error: 'Failed to set token or fetch user data' },
      { status: 500 }
    );
  }
}
