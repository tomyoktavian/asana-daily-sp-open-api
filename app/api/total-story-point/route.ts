import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AsanaClient } from '@/lib/asana';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('asana_access_token')?.value;
  const userGid = cookieStore.get('asana_user_gid')?.value;
  const workspaceGid = cookieStore.get('asana_workspace_gid')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!userGid || !workspaceGid) {
    return NextResponse.json({ error: 'User or workspace data not found. Please login again.' }, { status: 401 });
  }

  try {
    const client = new AsanaClient(accessToken);

    const searchParams = request.nextUrl.searchParams;
    const createdAfter = searchParams.get('created_after');
    const createdBefore = searchParams.get('created_before');
    const completedParam = searchParams.get('completed');
    const completed = completedParam === 'false' ? false : completedParam === 'true' ? true : false;

    const totalStoryPoint = await client.getTotalStoryPoint({
      workspaceGid,
      assigneeGid: userGid,
      completed,
      ...(createdAfter && { createdAfter }),
      ...(createdBefore && { createdBefore }),
    });

    return NextResponse.json({
      totalStoryPoint,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch total story point', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
