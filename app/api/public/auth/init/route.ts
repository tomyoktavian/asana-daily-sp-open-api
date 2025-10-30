import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 401 });
  }

  try {
    // Get user info
    const userResponse = await fetch('https://app.asana.com/api/1.0/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userData = await userResponse.json();
    
    // Get workspaces
    const workspacesResponse = await fetch('https://app.asana.com/api/1.0/workspaces', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!workspacesResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 401 });
    }

    const workspacesData = await workspacesResponse.json();

    return NextResponse.json({
      user: {
        gid: userData.data.gid,
        name: userData.data.name,
        email: userData.data.email,
      },
      workspaces: workspacesData.data,
      workspace_gid: userData.data.workspaces[0]?.gid || workspacesData.data[0]?.gid,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initialize', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
