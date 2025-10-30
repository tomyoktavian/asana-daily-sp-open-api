import { NextRequest, NextResponse } from 'next/server';
import { AsanaClient } from '@/lib/asana';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');
  const userGid = request.headers.get('x-asana-user-gid');
  const workspaceGid = request.headers.get('x-asana-workspace-gid');

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!userGid || !workspaceGid) {
    return NextResponse.json({ error: 'User or workspace data not found. Please login again.' }, { status: 401 });
  }

  try {
    const client = new AsanaClient(accessToken);
    
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const searchParams = request.nextUrl.searchParams;
    const dateFilter = searchParams.get('date');
    const createdAfter = searchParams.get('created_after');
    const createdBefore = searchParams.get('created_before');
    const completedParam = searchParams.get('completed');
    const completed = completedParam === 'false' ? false : completedParam === 'true' ? true : false;

    let tasks = await client.getTasks({
      workspaceGid,
      assigneeGid: userGid,
      completed,
      ...(createdAfter && { createdAfter }),
      ...(createdBefore && { createdBefore }),
    });

    if (dateFilter) {
      let modifiedSince: Date;
      
      if (dateFilter === 'yesterday') {
        modifiedSince = yesterday;
      } else if (dateFilter === 'today') {
        modifiedSince = today;
      } else {
        modifiedSince = new Date(0);
      }
      
      tasks = tasks.filter(task => {
        const taskModified = new Date(task.modified_at || task.created_at);
        return taskModified >= modifiedSince;
      });
    }

    return NextResponse.json({
      tasks,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
