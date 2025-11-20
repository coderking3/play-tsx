import { bold, cyan, green, red, yellow, blue, dim } from 'ansis'

// warnings
console.warn(`${yellow('⚠️ Root directory not found:')} ${dim('resolvedDir')}`)
console.warn(`${yellow('⚠️ Tsconfig not found:')} ${dim('resolvedConfig')}`)

// errors



// info
console.log(
  `${yellow('⚠️ Missing dependency:')} ${bold('pkg')}\n  Installing via ${cyan('manager')}...`
)
console.log(`${green.bold('✅ Installed:')} ${green('pkg')}`)



console.log(`${blue.bold('dir')}:`)

console.log(`  ${dim(24)}. ${green('file.name')}`)


// import { bold, cyan, green, red, yellow, blue, dim } from 'ansis'
// import { bold, cyan, green, red, yellow, magenta } from 'ansis'
