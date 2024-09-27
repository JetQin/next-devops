// "use client";

import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { taskSchema } from "./data/schema"
import { useEffect, useState } from "react"


// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(protected)/dashboard/repos/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function TaskPage() {
  const tasks = await getTasks()
  // const [tasks, setTasks] = useState([])

  // useEffect(() => {
  //   fetch('/api/repos', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ owner: "JetQin", repo: "next-devops" }),
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       return res;
  //     })
  //     .then((data) => {
  //       // setTasks(data)
  //       console.log(data);
  //     })
  // }, [])

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  )
}
