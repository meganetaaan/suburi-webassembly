const execSleep = Module.cwrap('exec_sleep_c', void 0, ['number', 'number'])
const funcRef = Runtime.addFunction(() => {
    console.log(`callback from exec_sleep_c ${Date.now()}`);
    alert('callback')
    Runtime.removeFunction(funcRef)
})

execSleep(1000, funcRef)
console.log(`exec_sleep_c called ${Date.now()}`)