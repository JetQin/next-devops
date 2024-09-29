"use client";

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { Task } from "./data/schema"
import { useEffect, useState } from "react"



export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleScan = (owner: string, repo: string) => {
    setLoading(true);
    fetch('/api/repos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner: owner, repo: repo }),
    })
    .then((res) => res.json())
    .then((alerts) => {
      const newTasks = alerts.map(alert => ({
        id: alert.number.toString(),
        cve: alert.security_advisory.cve_id || '',
        title: alert.security_advisory.summary || '',
        status: alert.state || '',
        label: alert.security_advisory.cve_id || '',
        priority: alert.security_advisory.severity,
        owner: owner,
        repo: repo
      }));
      setTasks(newTasks);
      setLoading(false);
    })
  }

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <DataTable data={tasks} columns={columns} loading={loading} handleScan={handleScan} handleRefresh={handleScan} />
      </div>
    </>
  )
}
