const notes = require('./notes.js')
const yargs = require('yargs')

//Creating Add Command
yargs.command({
    command: 'add',
    describe: 'Add a note',
    builder: {
        title: {
            describe: 'Note Title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note Body',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function(argv) {
        notes.addNotes(argv.title, argv.body)
    }
})

//Create Remove Command
yargs.command({
    command: 'remove',
    describe: 'Removing a note',
    handler: function() {
        console.log('Removing a note')
    }
})

//Create Read command
yargs.command({
    command: 'read',
    describe: 'Read note',
    handler: function () {
        console.log('Reading notes...')
    }
})

//Create List command
yargs.command({
    command: 'list',
    describe: 'List notes',
    handler: function (){
        console.log('Listing notes')
    }
})

yargs.parse()