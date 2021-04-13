let date = new Date();
let month = ('0' + (date.getMonth() + 1)).slice( -2 );
let year = date.getFullYear().toString().substr( -2 );

// Info strings
const serverURL = 'https://dt.waimea.school.nz';
const os = '<strong><em>COPNIX</em> (C) 1967-2020, Copley MegaSystems Inc.</strong>';
const server = 'Waimea College DT Server';
const ver = `System Version: ${year}.${month}`;
const host = '<em>Waimea College</em> is a secondary school in Richmond, New Zealand\n' +
             ' The <em>Digital Technologies</em> department is awesome\n' +
             ' This is the <em>DT Server</em> where we keep all of our fun stuff';

// The 'prompt' is CSS styled, but this NBSP sits after it to make sure the
// user input remains within the div / span below for easier processing of commands
const prompt = '<div class="command"><span>&nbsp;</span></div>';

// 'boot-up' tasks
const bootSteps = [
    'Checking stuff',
    'Initialising things',
    'Clearing out junk',
    'Applying updates',
    'Securing secrets',
    'Reticulating splines',
    'Connecting to cloud',
    'Starting the Internet',
    'Checking 0s and 1s',
    'Downloading more RAM',
    'Unpacking packages',
    'Deleting System32',
    'Removing viruses',
    'Demagnitising discs',
    'Filtering bad files'
];

// user activities
const games = [
    'minecraft',
    'portal2',
    'fallout4',
    'west-of-loathing',
    'tf2',
    'half-life-3',
    'terraria',
    'stardew-valley',
    'black-ops4',
    'halo',
    'gta6',
    'cookie-clicker',
    'valorant',
    'rocket-league',
    'league-of-legends'
];

const users = {
    'copley'    : { 'tty': 'pts/1', 'procs' : ['edit grades', 'ignore marking'].concat( games ) },
    'notch'     : { 'tty': 'pts/2', 'procs' : ['edit new-secret-game'].concat( games ) },
    'jardern'   : { 'tty': 'pts/9', 'procs' : ['troll-trump', 'ddos-whitehouse'].concat( games ) },
    'billgates' : { 'tty': 'pts/5', 'procs' : ['kill-linux', 'hack-apple'].concat( games ) },
    'nsa-govt'  : { 'tty': 'tty/0', 'procs' : ['monitor', 'track', 'ddos', 'getroot', 'hack'] },
    'shaines'   : { 'tty': 'pts/3', 'procs' : ['edit cpy-promotion'].concat( games ) }
};

// List of links that can be opened, some conditional on user being logged in
let links = {};
    links.dt = { name: 'DT Server home',   url: '/' };
    if( username != 'guest' ) links.home  = { name: 'Your home folder', url: '/~' + username };
    if( username != 'guest' ) links.homes = { name: 'Student homes',    url: '/homes.php' };
    links.dbs    = { name: 'MySQL databases',  url: '/dbs' };
    links.code   = { name: 'Coding server',    url: '/code' };
    links.help   = { name: 'DT help',          url: '/help' };
    links.choose = { name: 'DT subject info',  url: '/choose' };
    if( username != 'guest' ) links.account = { name: 'Your server account', url: '/user/' + username };

// Command list
const commands = {
    'ls | list'      : 'List all links',
    'open | cd code' : 'Open link \'code\'',
    'ps'             : 'Running processes',
    'who'            : 'Active users',
    'whoami'         : 'Your user id',
    'host'           : 'Host details',
    'sys | uname'    : 'System details',
    'login'          : 'Login to server',
    'logout'         : 'Logout of shell',
    'clear | cls'    : 'Clear screen',
    'reboot'         : 'Restart shell',
    'help | man'     : 'This help message'
};

// Hopld the ref. to the editable 'shell' div
let shell;





// Helper functions to Wrap given text into a div/span with a given class
const wrapBlock = ( text, type='output' ) => { return `<div class="${type}">${text}</div>`; };
const wrapSpan  = ( text, type='error' )  => { return `<span class="${type}">${text}</span>`; };

// Helper function to pad a given number out with leading zeros
const padZero  = ( num, digits=2 ) => { return ('000000' + num).slice( -digits ); };

// Helper functions to generate various random values
const randNum  = ( max ) => { return Math.floor( Math.random() * max ); };
const randByte = () => { return randNum( 256 ); };
const randIP   = () => { return `${randByte()}.${randByte()}.${randByte()}.${randByte()}`; };
const randPID  = () => { return randNum( 49999 ) + 50000; };
const randCPU  = () => { return `${randNum( 25 )}.${randNum( 10 )}`.padStart( 4 ); };
const randMS   = () => { return padZero( randNum( 60 ) ); };
const randTime = () => { return `${randMS()}:${randMS()}`; };

// Helper function to format a date / time in ISO-ish format
const formatDate = ( date ) => {
    let year   = date.getFullYear(),
        month  = padZero( date.getMonth() + 1 ), // months are zero indexed
        day    = padZero( date.getDate() ),
        hour   = padZero( date.getHours() ),
        minute = padZero( date.getMinutes() );

    return `${year}-${month}-${day} ${hour}:${minute}`;
};

// Generate random date / times based to right now, but in the past a bit
const randDateTime = () => { return formatDate( new Date( date.getTime() - 60000 - Math.random() * 600000000 ) ); };
const recentDateTime = () => { return formatDate( new Date( date.getTime() - 1200000 ) ); };


/*--------------------------------------------------------------
 * Shift cursor to end of editable div
 *
 * Does this by creating a selection based on the last sub-div
 * within the editable div (divs are created for each line of
 * text) and the span within that last sub-div. The selection
 * is collapsed down to a single location and the editable div
 * is scrolled to reveal it
 */
const cursorToEnd = () => {
    let commandPrompt = shell.lastChild;
    let endOfPrompt = commandPrompt.lastChild;
    let range = document.createRange();

    if( endOfPrompt.children.length > 0 ) {
        range.selectNodeContents( endOfPrompt.lastChild );  // Select the br within the span within the last div
        range.collapse( true );                             // collapse the range to the start point (true)
    }
    else {
        range.selectNodeContents( endOfPrompt );  // Select the span within the last div
        range.collapse( false );                  // collapse the range to the end point (false)
    }

    let selection = window.getSelection();  // get the selection object (allows you to change selection)
    selection.removeAllRanges();            // remove any selections already made
    selection.addRange( range );            // make the range you have just created the visible selection
    commandPrompt.scrollIntoView();         // Make sure we can see the last div
};


/*--------------------------------------------------------------
 * startShell - Go through a 'boot-up' sequence
 *
 * Uses a series of clock 'ticks' to display various messages
 * and 'progress' meters
 */
function startShell() {
    shell = document.getElementById( 'shell' );

    // Shuffle up boot items so we get random ones each time
    let shuffledSteps = bootSteps.map((a) => ({sort: Math.random(), value: a}))
                                 .sort((a, b) => a.sort - b.sort)
                                 .map((a) => a.value);
    let step = 0;
    let ticksPerStep = 20;
    let numSteps = 4;
    let ticks = 0;

    // Kick off the timer
    let dotTimer = setInterval( bootUp, 40 );

    function bootUp() {
        // This first block deals with the boot 'tasks'
             if( ticks == step * ticksPerStep )      shell.innerHTML  = wrapBlock( os );
        else if( ticks <  step * ticksPerStep + 4 )  shell.innerHTML += '';
        else if( ticks == step * ticksPerStep + 4 )  shell.innerHTML += wrapBlock( shuffledSteps[step] );
        else if( ticks <  step * ticksPerStep + 14 ) shell.innerHTML += '.';
        else if( ticks == step * ticksPerStep + 14 ) shell.innerHTML += ' Done!';
        else if( ticks <  step * ticksPerStep + 19 ) shell.innerHTML += '';
        else if( ticks == step * ticksPerStep + 19 ) { if( step < numSteps - 1 ) step++; }

        // This is the subsequent welcome message
        else if( ticks == numSteps * ticksPerStep )     shell.innerHTML  = wrapBlock( os );
        else if( ticks == numSteps * ticksPerStep + 2 ) shell.innerHTML += wrapBlock( ver );
        else if( ticks == numSteps * ticksPerStep + 5 ) shell.innerHTML += wrapBlock( server );
        else if( ticks == numSteps * ticksPerStep + 6 ) shell.innerHTML += wrapBlock( `Welcome ${username}!` );
        else if( ticks == numSteps * ticksPerStep + 7 ) shell.innerHTML += wrapBlock( "Type \'help\' for a list of commands", 'output tip' );
        else if( ticks == numSteps * ticksPerStep + 8 ) shell.innerHTML += wrapBlock( '<br>' );

        // And at this point, we're done
        else if( ticks >= numSteps * ticksPerStep + 10 ) {
            // Cancel the timer and get ready for user input
            clearInterval( dotTimer );
            shell.innerHTML += prompt;
            cursorToEnd();
            shell.focus();
        }

        ticks++;
    }

    // Prevent mouse clicks moving the input cursor
    shell.addEventListener( 'click', () => {
        cursorToEnd();
    } );
}


/*--------------------------------------------------------------
 * checkKey - Dumps any unwanted key presses
 *
 * Stops cursor movement (breaks the input by moving from a
 * known place within the div/span) and also doesn't allow the
 * delete key to go back beyond the current input line
 */
function checkKey( e ) {
    let code = (e.keyCode ? e.keyCode : e.which);
    //console.log( code );

    let cancelKey = false;

    // Cursor keys
    if( code >= 37 && code <= 40 ) cancelKey = true;

    // Delete - not prompt
    else if( code == 8 ) {
        let shellText = shell.innerText;
        let lines = shellText.split( '\n' );
        let lastLine = lines[ lines.length - 1 ];
        //console.log( lastLine );
        //console.log( lastLine.length );

        if( lastLine.length == 1 ) cancelKey = true;
    }

    // Should the key be dumped?
    if( cancelKey ) {
        e.preventDefault();
        return false;
    }
}


/*--------------------------------------------------------------
 * processKey - Deal with the enter key submitting a command
 *
 * Processes the current line when Enter pressed and display
 * the resulting output
 */
function processKey( e ) {
    let code = (e.keyCode ? e.keyCode : e.which);
    //console.log( code );

    // Any other key we pass through
    if( code != 13 ) {
        //cursorToEnd();
        return;
    }

    // Get the last editor line
    let shellText = shell.innerText;
    let lines = shellText.split( '\n' );
    let lastLine = lines.filter( item => item ).pop( -1 );  // Get last non-blank line
    //console.log( 'Line: ' + lastLine );

    // Ignore the NBSP prefix and pull out the command
    let command = lastLine.substr( 1 );
    console.log( 'Command: ' + command );

    // Run the command and put the output and a new prompt into the editable div
    let shellHTML = runCommand( command );
    shellHTML += prompt;
    shell.innerHTML = shellHTML;

    // Get ready for next input
    cursorToEnd();

    // Don't process the actual return key press
    e.preventDefault();
    return false;
}


/*--------------------------------------------------------------
 * runCommand - Given a command line, run the command with
 *              any applicable arguments
 *
 * Pulls out any args from the command line, then acts on the
 * command, returning the ouptut produced
 */
function runCommand( commandLine ) {
    // Start with the surrent state of the editable div, with a new div ready for any new output
    let output = shell.innerHTML + '<div class="output"><pre>';

    // Break up the command / args
    commandLine = commandLine.toLowerCase();
    let parts = commandLine.split( ' ' );
    let command = parts[0];
    let arg = parts.length > 1 ? parts[1] : '';

    // What's the command?
    switch( command ) {

        case 'login':
            // jump to the basic-auth login window, redirecting back to here
            window.location.replace( serverURL + '/login.php?next=term' );
            break;

        case 'logout':
            // Jump back to server home
            window.location.replace( serverURL );
            break;

        case 'reboot':
        case 'restart':
            // Restart everything
            startShell();
            return;

        case 'help':
        case 'man':
            // Show the list of commands
            output += wrapSpan( ' Command          Action', 'heading' ) + '\n';
            Object.entries( commands ).forEach( ([key,info]) => {
                output += ` <em>${key.padEnd( 16 )}</em> ${info}\n`;
            } );
            break;

        case 'cls':
        case 'clear':
            // Dump all previous output
            output = '';
            break;

        case 'rm':
        case 'rmdir':
        case 'su':
        case 'sudo':
            // Banned commands!
            output += wrapSpan( ' Permission denied' );
            break;

        case 'pwd':
            // Current folder
            output +=  ` /home/${username}`;
            break;

        case 'host':
            // Host info
            output += ' ' + host;
            break;

        case 'whoami':
            // User info
            output += ` <em>${username}</em>`;
            break;

        case 'who':
            // Show all 'connected' users
            output += wrapSpan( ' User         TTY     Login             IP', 'heading' ) + '\n';
            output += ` <em>${username.padEnd( 12 )} pts/0   ${recentDateTime()}  (${randIP()})</em>\n`;
            output +=     ` root                 ${randDateTime()}\n`;

            for( const [user, info] of Object.entries( users ) ) {
                let tty = info.tty;
                output += ` ${user.padEnd( 12 )} ${tty}   ${randDateTime()}  (${randIP()})\n`;
            }
            break;

        case 'ps':
            // Show a list of user 'processes'
            output += wrapSpan( ' User          PID    %CPU  TTY    Time      Command', 'heading' ) + '\n';
            output += ` <em>${username.padEnd( 12 )}  ${randPID()}  ${randCPU()}  pts/0  00:00:${randMS()}  /bin/cop-shell</em>\n`;
            output += ` <em>${username.padEnd( 12 )}  ${randPID()}  ${randCPU()}  pts/0  00:00:${randMS()}  ps</em>\n`;

            // Random number of processes
            let numLines = Math.floor( Math.random() * 5 ) + 5;
            for( let i = 0; i < numLines; i++ ) {
                // Get a random user
                let keys = Object.keys( users );
                let numUsers = keys.length;
                let user = keys[Math.floor( Math.random() * numUsers )];
                // Get their term
                let tty = users[user].tty;
                // Get a random activity
                let numProcs = users[user].procs.length;
                let proc = users[user].procs[Math.floor( Math.random() * numProcs )];
                let folder = Math.random() > 0.5 ? '/bin/' : '/sbin/';

                output += ` ${user.padEnd( 12 )}  ${randPID()}  ${randCPU()}  ${tty}  00:${randTime()}  ${folder}${proc}\n`;
            }
            break;

        case 'uname':
        case 'sys':
            // System info
            output += ' ' + os + '\n';
            output += ' ' + ver;
            break;

        case 'ls':
        case 'list':
            // List of links
            output += wrapSpan( ' Code       Name                 URL', 'heading' ) + '\n';
            Object.entries( links ).forEach( ([key,info]) => {
                output += ` <em>${key.padEnd( 10 )}</em> ${info.name.padEnd( 20 )} ${info.url}\n`;
            } );
            break;

        case 'cd':
        case 'open':
            // Process an open command
            if( arg != '' ) {
                // Arg given to see if valid
                if( arg in links ) {
                    // Yep, so open in a new window
                    let name = links[arg].name;
                    let url = serverURL + links[arg].url;
                    output += ` Opening: <em>${name}</em> (${url}) ...`;
                    window.open( url );
                }
                else {
                    // Invalid
                    output += wrapSpan( ` Unknown link: ${arg}` );
                }
            }
            else {
                // No arg given
                output += wrapSpan( ' open: missing link code' ) + '\n';
                output += wrapSpan( ' Try open X, where X is the link code', 'tip' ) + '\n';
                output += wrapSpan( ' Use the ls command to see a list of links', 'tip' );
            }
            break;

        case '':
            // Ignore blank commands
            break;

        default:
            // Unknown
            output += wrapSpan( ` ${command}: unknown command` );
    }

    // Was output produced? If so, terminate the div
    if( output.length > 0 ) output += '</pre></div>';

    return output;
}
