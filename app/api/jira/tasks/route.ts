import { NextRequest, NextResponse } from 'next/server';

/**
 * Jira Task Response
 */
interface JiraTask {
  key: string;
  summary: string;
  status: string;
}

/**
 * GET /api/jira/tasks
 * Fetch tasks from Jira using JQL query
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user = searchParams.get('user');
    const sprint = searchParams.get('sprint');

    if (!user || !sprint) {
      return NextResponse.json(
        { success: false, message: 'User and sprint are required' },
        { status: 400 }
      );
    }

    // Get Jira API credentials from environment variables
    // Support both JIRA_API_TOKEN and JIRA_API_KEY for compatibility
    let jiraUrl = process.env.JIRA_URL || process.env.JIRA_BASE_URL;
    const jiraEmail = process.env.JIRA_EMAIL;
    const apiToken =
      process.env.JIRA_API_TOKEN || process.env.JIRA_API_KEY || process.env.JIRA_PASSWORD;

    if (!jiraUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'JIRA_URL hoặc JIRA_BASE_URL không được tìm thấy trong environment variables',
        },
        { status: 500 }
      );
    }
    if (!apiToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            'JIRA_API_TOKEN hoặc JIRA_API_KEY không được tìm thấy trong environment variables',
        },
        { status: 500 }
      );
    }
    if (!jiraEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'JIRA_EMAIL không được tìm thấy trong environment variables',
        },
        { status: 500 }
      );
    }

    // Đảm bảo JIRA_URL không có trailing slash
    jiraUrl = jiraUrl.replace(/\/$/, '');

    // Build JQL query dynamically
    // Format: assignee = currentUser() AND sprint = "TMS03 Sprint {sprint}" ORDER BY updated DESC
    const sprintName = `TMS03 Sprint ${sprint}`;
    const jqlQuery = `assignee = currentUser() AND sprint = "${sprintName}" ORDER BY updated DESC`;

    // Jira API sử dụng Basic Auth với format: email:api_token
    const auth = Buffer.from(`${jiraEmail}:${apiToken}`).toString('base64');

    // Sử dụng endpoint mới /rest/api/3/search/jql (POST method)
    // Endpoint cũ /rest/api/3/search đã bị loại bỏ từ tháng 5/2025
    const apiUrl = `${jiraUrl}/rest/api/3/search/jql`;

    // Format request body cho API mới
    const requestBody = {
      jql: jqlQuery,
      fields: [
        'summary',
        'status',
        'priority',
        'assignee',
        'created',
        'updated',
        'issuetype',
        'project',
      ],
      maxResults: 50,
    };

    // Fetch tasks from Jira API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Jira API error: ${response.status} ${response.statusText}`;

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.errorMessages && errorJson.errorMessages.length > 0) {
          errorMessage = errorJson.errorMessages.join(', ');
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        errorMessage += ` - ${errorText.substring(0, 200)}`;
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          error: errorText,
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      issues?: Array<{
        key: string;
        fields: {
          summary: string;
          status: {
            name: string;
          };
        };
      }>;
    };

    // Transform Jira issues to task list
    const tasks: JiraTask[] =
      data.issues?.map((issue) => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
      })) || [];

    // Format tasks as a readable string
    const tasksText = tasks
      .map((task) => `- ${task.key}: ${task.summary} (${task.status})`)
      .join('\n');

    return NextResponse.json({
      success: true,
      data: {
        tasks,
        tasksText,
        count: tasks.length,
      },
    });
  } catch (error) {
    console.error('Error fetching Jira tasks:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch tasks from Jira',
      },
      { status: 500 }
    );
  }
}
