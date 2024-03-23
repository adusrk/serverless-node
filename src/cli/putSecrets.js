// require("dotenv").config();
const secrets = require('../lib/secrets.js')
const args = process.argv.slice(2)

if(args.length !== 2){
    console.log('Usage: tsx src/cli/putSecrets.js <stage> <dbUrl>')
    process.exit(1)
}

if (require.main === module) {
    console.log("Update secret!");
  const[stage, dbUrl] = args
  secrets.putDatabaseUrl(stage, dbUrl).then(val=>{
    console.log(`Secret set ${val}`)
    process.exit(0)
  }).catch(err=>{
    console.log(`Secret not set ${err}`)
    process.exit(1)
  })
}
