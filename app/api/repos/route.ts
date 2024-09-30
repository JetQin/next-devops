import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN // Replace with your GitHub personal access token
});

async function getDependantAlerts(owner:string, repo:string, alert_number?: number) {
    try {
        let dependabotUrl = ""
        if(alert_number){
            dependabotUrl = 'GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}'
        }else{
            dependabotUrl = 'GET /repos/{owner}/{repo}/dependabot/alerts'
        }
        console.log(dependabotUrl);

        const response = await octokit.request(dependabotUrl, {
            owner: owner,
            repo: repo,
            alert_number: alert_number,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
        return response;
    } catch (error) {
        console.error(`Error fetching security alerts: ${error}`);
    }
}

export async function POST(req: NextRequest) {
    const data = await req.json()
    const { owner, repo, number } = data;
    if (req.method === 'POST') {
        try {
            const rsp  = await getDependantAlerts(owner, repo, number);
            return NextResponse.json(rsp?.data);
        } catch (error) {
            NextResponse.json({ error: 'Failed to fetch data' });
        }
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405, headers: { 'Allow': 'POST' } });
    }
}

