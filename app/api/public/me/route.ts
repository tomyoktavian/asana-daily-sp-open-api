import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  // Get token from Authorization header or query param
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token required. Use Authorization: Bearer YOUR_TOKEN or ?token=YOUR_TOKEN' }, { status: 401 });
  }

  try {
    // Get user info
    const userResponse = await axios.get('https://app.asana.com/api/1.0/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const userData = userResponse.data;
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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.json(
        { error: 'Failed to fetch user data', details: error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch user data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
