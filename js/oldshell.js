const prompt = 'user@cpy $';
const promptStyled = '<span class="prompt">' + prompt + '</span><span class="command">&nbsp;</span>';
const os = '<strong><em>COPLIX</em> (C) 1967-2020, Copley MegaSystems Inc.</strong>';
const ver = 'System Version: 20.10';
const host = '<em>Waimea College</em> is a secondary school in Richmond, New Zealand';

const bootSteps = [
    'Checking Things',
    'Initialising Stuff',
    'Clearing Junk'
];

const projects = {
    'dt'    : { name: 'DT Server',       url: 'https://dt.waimea.school.nz' },
    'dbs'   : { name: 'MySQL Databases', url: 'https://dt.waimea.school.nz/dbs' },
    'code'  : { name: 'Coding Server',   url: 'https://dt.waimea.school.nz/code' }
};

var shell;


const cursorToEnd = ( el ) => {
    var range,selection;
    range = document.createRange();     // Create a range (a range is a like the selection but invisible)
    range.selectNodeContents( el );     // Select the entire contents of the element with the range
    range.collapse( false );            // collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection();  // get the selection object (allows you to change selection)
    selection.removeAllRanges();        // remove any selections already made
    selection.addRange( range );        // make the range you have just created the visible selection

    el.lastChild.scrollIntoView();
};

function startShell() {
    shell = document.getElementById( 'shell' );

    let shuffledSteps = bootSteps.map((a) => ({sort: Math.random(), value: a}))
                                 .sort((a, b) => a.sort - b.sort)
                                 .map((a) => a.value);
    var step = 0;
    var stepTime = 20;
    var ticks = 0;
    var dotTimer = setInterval( bootUp, 50 );

    function bootUp() {
             if( ticks == step * stepTime )      shell.innerHTML  = os + '<br>' + shuffledSteps[step] + ' ';
        else if( ticks <  step * stepTime + 14 ) shell.innerHTML += '.';
        else if( ticks == step * stepTime + 14 ) shell.innerHTML += ' Done!<br>';
        else if( ticks <  step * stepTime + 19 ) shell.innerHTML += '';
        else if( ticks == step * stepTime + 19 ) { if( step < shuffledSteps.length - 1 ) step++; }

        else if( ticks == 60 ) shell.innerHTML  = os + '<br>' + ver + '<br>';
        else if( ticks == 65 ) shell.innerHTML += 'Welcome!<br><span class="tip">Type \'help\' for a list of commands</span><br><br>';
        else if( ticks >= 70 ) {
            clearInterval( dotTimer );
            shell.innerHTML += promptStyled;
            cursorToEnd( shell );
            shell.focus();
        }

        ticks++;
    }

    shell.addEventListener( 'click', () => {
        cursorToEnd( shell );
    } );
}


function checkKey( e ) {
    var code = (e.keyCode ? e.keyCode : e.which);
    //console.log( code );

    var cancelKey = false;

    // Cursor keys
    if( code >= 37 && code <= 40 ) cancelKey = true;

    // Delete - not prompt
    else if( code == 8 ) {
        var shellText = shell.innerText;
        var lines = shellText.split( '\n' );
        var lastLine = lines[ lines.length - 1 ];

        console.log( lastLine );
        console.log( lastLine.length );

        if( lastLine.length == prompt.length + 1 ) cancelKey = true;
    }

    if( cancelKey ) {
        e.preventDefault();
        return false;
    }
}


function processKey( e ) {
    var code = (e.keyCode ? e.keyCode : e.which);
    //console.log( code );

    if( code != 13 ) {
        cursorToEnd( shell );
        return;
    }

    var shellText = shell.innerText;
    var lines = shellText.split( '\n' );
    var lastLine = lines[ lines.length - 3 ];
    console.log( 'Line: ' + lastLine );

    var command = lastLine.substr( prompt.length + 1 );
    console.log( 'Command: ' + command );

    // Clear <div>s added around <br>s
    var shellHTML = shell.innerHTML;
    shellHTML = shellHTML.replaceAll( '<div>', '' );
    shellHTML = shellHTML.replaceAll( '</div>', '' );
    shell.innerHTML = shellHTML;

    shellHTML = runCommand( command );
    shellHTML += promptStyled;
    shell.innerHTML = shellHTML;

    cursorToEnd( shell );
}


function runCommand( commandLine ) {
    var output = shell.innerHTML + '<span class="output"><pre>';

    commandLine = commandLine.toLowerCase();
    var parts = commandLine.split( ' ' );
    var command = parts[0];
    var arg = parts.length > 1 ? parts[1] : '';

    switch( command ) {
        case 'help':
        case 'man':
            output += ' <span class="heading">Command       Action</span>\n';
            output += ' <em>ls</em>            List projects\n';
            output += ' <em>open</em> code     Open project \'code\'\n';
            output += ' <em>host</em>          Host information\n';
            output += ' <em>sys</em>           System information\n';
            output += ' <em>clear</em>         Clear screen\n';
            output += ' <em>help</em>          This help message\n';
            break;

        case 'cls':
        case 'clear':
            output = '';
            break;

        case 'who':
        case 'host':
            output += ' ' + host + '<br>';
            break;

        case 'uname':
        case 'sys':
            output += ' ' + os + '<br> ' + ver + '<br>';
            break;

        case 'ls':
        case 'list':
            output += ' <span class="heading">Code       Name                 URL</span>\n';
            Object.entries( projects ).forEach( ([key,info]) => {
                output += ` <em>${key.padEnd( 10 )}</em> ${info.name.padEnd( 20 )} ${info.url}\n`;
            } );
            break;

        case 'load':
        case 'goto':
        case 'open':
            if( arg != '' ) {
                if( arg in projects ) {
                    var name = projects[arg].name;
                    var url = projects[arg].url;
                    output += ` Opening: <em>${name}</em> (${url}) ...<br>`;
                    window.open( url );
                }
                else {
                    output += `<span class="error">Unknown project: ${arg}</span><br>`;
                }
            }
            else {
                output += ' <span class="error">open: missing project code</span><br>';
                output += ' <span class="tip">Try open X, where X is the project code</span><br>';
                output += ' <span class="tip">Use the list command to see a list of projects</span><br>';
            }
            break;

        case '':
            break;

        default:
            output += ` <span class="error">${command}: unknown command</span><br>`;
    }

    if( output.length > 0 ) output += '</pre></span>';

    return output;
}
