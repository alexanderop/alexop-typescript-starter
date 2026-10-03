#!/usr/bin/env node
import { createProject, templateIds } from './templates.mjs'
const cliArguments = process.argv.slice(2)
const destination = cliArguments[0]
const templateIndex = cliArguments.indexOf('--template')
const nameIndex = cliArguments.indexOf('--name')
if (!destination || templateIndex < 0 || nameIndex < 0) {
  console.error(
    `Usage: pnpm create:project <destination> --template <${templateIds.join('|')}> --name <name>`,
  )
  process.exitCode = 1
} else {
  try {
    console.log(
      `Created project at ${createProject({ destination, template: cliArguments[templateIndex + 1], name: cliArguments[nameIndex + 1] })}`,
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
