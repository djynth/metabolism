var MENU;
var ABOUT;
var ACCOUNT;
var DATA;
var NEW_GAME;
var SETTINGS;
var TUTORIAL;

var FILTER;
var RESOURCE_VISUAL;

var FOOTER;
var HEADER;

var LOG;

var BODY;
var TURNS;
var POINTS;
var CONTENT_AREA;
var DIAGRAM;

var PATHWAYS;
var RESOURCES;

var RESULTS;

var STATE;
var LIMITED_RESOURCES;

var TRACKER;

$(document).ready(function() {
    MENU = $('#menu');
    ABOUT = MENU.find('.content.about');
    ACCOUNT = MENU.find('.content.account');
    DATA = MENU.find('.content.data');
    NEW_GAME = MENU.find('.content.new-game');
    SETTINGS = MENU.find('.content.settings');
    TUTORIAL = MENU.find('.content.tutorial');

    FILTER = $('#filter');
    RESOURCE_VISUAL = $('#resource-visual');

    FOOTER = $('#footer');
    HEADER = $('#header');

    LOG = $('#log');

    BODY = $('body');
    TURNS = $('#turns');
    POINTS = $('#points');
    CONTENT_AREA = $('#content-area');
    DIAGRAM = $('#diagram');

    PATHWAYS = $('.pathways').find('.pathway');
    RESOURCES = $('.resources').find('.res');

    RESULTS = $('#results');

    STATE = $('#state');
    LIMITED_RESOURCES = $('#limited-resources');
    
    TRACKER = $('#tracker');
});