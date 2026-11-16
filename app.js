const notes = require('./notes.js')
const yargs = require('yargs')

// Add command
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
        // Use programmatic addNote API for the CLI entrypoint
        notes.addNote(argv.title, argv.body)
    }
})

// Remove command
yargs.command({
    command: 'remove',
    describe: 'Removing a note',
    handler: function() {
        console.log('Removing a note')
    }
})

// Read command
yargs.command({
    command: 'read',
    describe: 'Read note',
    handler: function () {
        console.log('Reading notes...')
    }
})

// List command
yargs.command({
    command: 'list',
    describe: 'List notes',
    handler: function (){
        console.log('Listing notes')
    }
})

yargs.parse()
