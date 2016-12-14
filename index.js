require('./out/runtime/package');
system.import('things/wcb/server').catch(function(e){
    console.error(e.stack);
    process.exit(1);
});