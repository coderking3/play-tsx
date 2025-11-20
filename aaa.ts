import { bold, cyan, green, red, yellow, blue, dim } from 'ansis'


// warnings
console.warn(`${yellow('⚠️ Root directory not found:')} ${dim('resolvedDir')}`)
console.warn(`${yellow('⚠️ Tsconfig not found:')} ${dim('resolvedConfig')}`)
console.warn(`${yellow('⚠️ Cannot read directory:')} ${dim('dir')}`)
console.warn(`${yellow('⚠️ Directory does not exist:')} ${dim('targetDir')}`)


// errors
console.error(`${red.bold('❌ Error parsing arguments:')} ${red(String('error'))}`)
console.error(`${red.bold('❌ Failed to install:')} ${bold('pkg')}`)

// info
console.log(
  `${yellow('⚠️ Missing dependency:')} ${bold('pkg')}\n  Installing via ${cyan('manager')}...`
)
console.log(`${green.bold('✅ Installed:')} ${green('pkg')}`)

console.log(
  `\n${bold(cyan('📁 Available files:'))} ${blue('rootDir')} ${dim(
    `(${25} total)`
  )}\n`
)

console.log(`${blue.bold('dir')}:`)

console.log(`  ${dim(24)}. ${green("file.name")}`)
