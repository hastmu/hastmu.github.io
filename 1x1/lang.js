
var language
var lang

var lang_options={
    "en": "English",
    "de": "germany"
}

language=localStorage.getItem("language")
if ( language ==  null ) {
     language="en"
}

// default is en
lang={
    "title": "The amazing 1x1 trainger...",
    "set_goals_header": "Set your goals...",
    "number_of_tasks": "How many calculations for today? (e.g. 100)",
    "reaction_goal_question": "How fast to be perfect? (e.g. 2500 equal 2500ms)",
    "on": "ON",
    "your_inputs": "Enter here your guesses...",
    "feedback_table": "Watch here your results...",
    "on": "ON",
    "off": "OFF",
    "start": "Let's go...",
    "tt_start": "Click here to get your first/next task...",
    "set-goals": "Goals...",
    "tt_set-goals": "Click here to define your goals...",
    "reset_performance": "Reset performance table",
    "random_performance": "Randomize performance table",
    "current_results": "Current Results",
    "result_improvable": "Improvables",
    "result_good": "Good ones",
    "result_prefect": "Perfect ones",
    "current_task": "Current Task",
    "right_result": "Right Result",
    "done_well_counter": "Well done tasks",
    "task_feedback": "Task feedback",
    "show_timeout": "Show timeout for task",
    "goal_reached_title": "Amazing you reached one of your goals!!!",
    "about": "About",
    "about_header": "About me...",
    "about_body": "This is the amazing one times one trainer<br>I will help you to learn and memories the one times one<br>from 0 to 10.<br><br>You master it in your own speed and progress<br>until you reach your ultimate time goal.<br><br>All the best.<br>More Infos under:<br><a href='https://github.com/hastmu/The_amazing_1x1_trainer'>github.com/hastmu/The_amazing_1x1_trainer</a>",
    "close": "Close",
    "goal_reached_body": "Task goal: <div id='task_goal_reached'></div><br>Ultimate Goals: <div id='ultimte_goal_reached'></div>",
    "update_goals_button": "Set new goals...",
    "": "",
    "": "",
    "": "",
    "dummy": "dummy"
}

// de
if ( language == "de" ) {

    lang={
        "title": "Der wunderbare 1 mal 1s Trainer...",
        "set_goals_header": "Setze dein Ziel...",
        "number_of_tasks": "Wieviel Aufgaben willst du heute machen? (z.B. 100)",
        "reaction_goal_question": "Ab wann bist du \"Perfekt\"? (z.B. 2500 = 2500ms)",
        "on": "EIN",
        "your_inputs": "Gib hier dein Ergebnis ein...",
        "feedback_table": "Deine bisherigen Ergebnisse...",
        "off": "AUS",
        "start": "Los geht's...",
        "tt_start": "Klicke hier für die nächste Aufgabe...",
        "set-goals": "Ziele...",
        "tt_set-goals": "Klicke hier um deine Ziele festzulegen...",
        "reset_performance": "Rücksetzten deiner Ergebnisse",
        "random_performance": "Verwürfeln deiner Ergebnisse",
        "current_results": "Current Results",
        "result_improvable": "Richtig!, nur noch schneller...",
        "result_good": "Gute",
        "result_prefect": "Perfekte",
        "current_task": "Aktuelle Aufgabe",
        "right_result": "Richtige Ergebnisse",
        "done_well_counter": "Gelöste Aufgaben",
        "task_feedback": "Aufgaben Rückmeldung",
        "show_timeout": "Timeout anzeigen?",
        "goal_reached_title": "Wunderbar du hast eines deiner Ziele erreicht!!!",
        "about": "Über mich...",
        "about_header": "Über mich...",
        "about_body": "Das ist der wunderbare 1x1 Trainer<br>Ich helfe dir das 1x1 zu lernen von 0 bis 10.<br><br>In deiner Geschwindigkeit und deinem Fortschritt<br>bis du alles perfekt kannst.<br><br>Viel Erfolg.<br>Mehr Infos Infos unter:<br><a href='https://github.com/hastmu/The_amazing_1x1_trainer'>github.com/hastmu/The_amazing_1x1_trainer</a>",
        "close": "Schließen",
        "goal_reached_body": "Aufgaben für heute: <div id='task_goal_reached'></div><br>Perfekte Aufgaben: <div id='ultimte_goal_reached'></div>",
        "update_goals_button": "Weiter mit neuen Zielen...",
           "dummy": "dummy"
        }

} 

// render lang menu

function set_lang(t_lang) {
    localStorage.setItem("language",t_lang)
    location.reload()
}

function render_lang_menue(id) {
    var t_html=""
    for (var lang in lang_options) {
        console.log(lang, lang_options[lang])
        t_html+="<a class=\"dropdown-item\" href=\"#\" onclick=\"set_lang('"+lang+"')\">"+lang+" ("+lang_options[lang]+")</a>"
    }
    $(id).html(t_html)
}

// set main items

function lang_set_item(item) {
    langattr=item.getAttribute("lang")
    if ( langattr == null ) {
        item.setAttribute("lang",item.innerHTML)    
        langattr=item.getAttribute("lang")
    }
    // console.log(langattr)
    if ( lang[langattr] == undefined ) {
        console.log("missing lang["+language+"]: "+langattr+" undefined")
    }
    item.innerHTML=lang[langattr]
    // console.log(item.innerHTML)

}

function render_lang(item) {
    if ( item == undefined ) {
        document.title=lang["title"]
        var langitems=$('lang')
        // console.log(langitems.length)
        for (let i = 0; i < langitems.length; i++) {
            lang_set_item(langitems[i])
        }    
    } else {
        // console.log(item)
        found=item.find("lang")
        lang_set_item(found[0])
    }
}

function render_langattr() {
    var langitems=$('langattr')
    // console.log(langitems.length)
    for (let i = 0; i < langitems.length; i++) {
        target=langitems[i].getAttribute("target")
        langitems[i].parentElement.setAttribute(target,lang[langitems[i].innerHTML])
        langitems[i].remove()
//        lang_set_item(langitems[i])
    }    
}
