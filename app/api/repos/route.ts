
import { Octokit } from "octokit";
// import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from "next/types";

const octokit = new Octokit({
  auth: process.env.GITHUB_SECRET // Replace with your GitHub personal access token
});

async function getDependantAlerts(owner, repo) {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/dependabot/alerts', {
        owner,
        repo,
        headers: {
            accept: 'application/vnd.github.dorian-preview+json'
        }
        });

        return response;
    } catch (error) {
        console.error(`Error fetching security alerts: ${error}`);
    }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("---------------");
    console.log(req.method);
    const { owner, repo } = JSON.parse(req.body);
    console.log(owner);
    console.log("---------------");
    if (req.method === 'POST') {
        try {
            const data  = await getDependantAlerts(owner, repo);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}



export async function GET(req: NextApiRequest, res: NextApiResponse) {
    console.log("-----------------------------------------------");
    console.log("req method:"+req.method);
    if (req.method === 'GET') {
        try {
            console.log(req.query);
            console.log(req.url);
            console.log(req.cookie);
            const {owner, repo} = req.query;
            console.log(owner);
            console.log(repo);
            const data  = await getDependantAlerts(req.owner, req.repo);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
