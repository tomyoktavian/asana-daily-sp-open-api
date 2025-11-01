import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 401 });
  }

  try {
    // Get user info
    const userResponse = await axios.get('https://app.asana.com/api/1.0/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const userData = userResponse.data;
    
    // Get workspaces
    const workspacesResponse = await axios.get('https://app.asana.com/api/1.0/workspaces', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const workspacesData = workspacesResponse.data;

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
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.json(
        { error: 'Failed to initialize', details: error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to initialize', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
