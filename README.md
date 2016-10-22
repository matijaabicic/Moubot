# Moubot

Moubot in action:
![Alt text](images/MourinhoInAction.png?raw=true "Moubot in Action")

Jose Mourinho Slack Bot - whines or gloats in your Slack channel after every
~~Chelsea~~ Manchester United game. Moubot also likes a healthy dose of pre-game banter.

You can execute Moubot in 2 ways (in both instances set debug: true in settings.js):

1) Run with heroku tool kit if you plan on deploying to heroku:

    heroku local web

2) Standard node execution:

    node server.js

or

    supervisor server.js

Note - if you are running with heroku local tool, you will need an .env file that contains 2 variables, one on each line in the file:

    resultsToken = -- your API key for football-data.org --
    slackURI = -- your private Slack URI. --

When you have these two keys, you are ready to deploy to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/matijaabicic/Moubot)

Get in touch on https://twitter.com/matijaabicic
