<?php

    if( isset( $_SERVER['PHP_AUTH_USER'] ) ) {
        $user = strtolower( $_SERVER['PHP_AUTH_USER'] );
    }
    else {
        $user = 'guest';
    }

    header("Content-type: text/css; charset: UTF-8");

?>

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap');

:root {
    --page-back: #333;
    --main-back: #000;
    --main-fore: #ccc;
    --main-fore-high: #fff;
    --main-fore-low: #666;
    --main-fore-err: #f33;
    --main-border: #999;
    --main-accent1: #0c0;
    /*--main-accent2: #39f;*/
    /*--main-accent1: #6bf;*/
    --main-accent2: #ff9;
}

html {
    color: var(--main-fore);
    background: var(--page-back);
    /*background-image: linear-gradient( var(--main-back), var(--page-back) );*/
    /*background-image: url('/theme/images/rainbow-rev.png'), linear-gradient( var(--main-back), var(--page-back) );*/
    /*background-position: bottom right;*/
    /*background-repeat: no-repeat;*/
    /*background-attachment: fixed;*/
    /*background-size: cover;*/
    /*background: radial-gradient(circle, var(--main-accent1) 0%, var(--main-back) 100%);*/
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    line-height: 1.2em;
}

body {
    min-height: calc(100vh - 2em);
    margin: 1em 0.5em;
    display: flex;
    flex-direction: column;
    background: var(--main-back);
    border: 1px solid var(--main-border);
}

h1, h2, h3, h4, h5, p {
    font-size: 1rem;
    line-height: 1.2em;
}

h1, h2, h3, h4, h5 {
    color: var(--main-accent1);
}

a {
    color: var(--main-accent1);
    text-decoration: none;
    display: inline-block;
    border-bottom: 1px solid var(--main-fore-low);
}

a:hover, a:active {
    color: var(--main-fore-high);
    border-bottom-color: var(--main-fore-high);
}

strong {
    /*font-weight: normal;*/
    /*color: var(--main-fore-high);*/
}

em {
    font-style: normal;
    color: var(--main-accent2);
}


main {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--main-fore-low) var(--main-back);
    margin: 0 0 0.5em 0;
    padding: 0.5em;
}

main::-webkit-scrollbar {
    width: 11px;
}

main::-webkit-scrollbar-track {
    background: var(--main-back);
}

main::-webkit-scrollbar-thumb {
    background-color: var(--main-fore-low) ;
    border: 2px solid var(--main-back);
}

#shell {
    width: 100%;
    height: calc(100vh - 9em);
    resize: none;
    color: var(--main-fore);
    background-color: transparent;
    border: none;
    resize: none;
    outline: none;
    caret-color: var(--main-fore-high);
}

#shell div.command::before {
    content: '<?= $user ?>@dt $';
    color: var(--main-accent1);
}

#shell div.command         { color: var(--main-fore-high); }
#shell div.output.tip,
#shell div.output .tip     { color: var(--main-fore-low); font-style: italic }
#shell div.output .error   { color: var(--main-fore-err); }
#shell div.output .heading { color: var(--main-fore-low); font-style: italic }

@media screen and (min-width: 480px) {
    html {
        font-size: 14px;
    }
}


@media screen and (min-width: 640px) {
    html {
        font-size: 16px;
    }
}


@media screen and (min-width: 90ch) {
    html {
        font-size: 18px;
    }
    body {
        max-width: 82ch;
        min-height: calc(100vh - 3em);
        margin: 1.5em auto;
    }
}
