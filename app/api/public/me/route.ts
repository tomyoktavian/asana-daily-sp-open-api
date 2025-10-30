import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get token from Authorization header or query param
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token required. Use Authorization: Bearer YOUR_TOKEN or ?token=YOUR_TOKEN' }, { status: 401 });
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
    const userGid = userData.data.gid;
    const userName = userData.data.name;
    const userEmail = userData.data.email;
    const workspaces = userData.data.workspaces;
    const workspaceGid = workspaces[0]?.gid;

    if (!workspaceGid) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 400 });
    }

    return NextResponse.json({
      user: {
        gid: userGid,
        name: userName,
        email: userEmail
      },
      workspace: {
        gid: workspaceGid,
        name: workspaces[0].name
      },
      workspaces: workspaces
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
