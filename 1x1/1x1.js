
// global variables
var map=[];             // map of timings
var bettermap=[];       // map of stage to detect improvements
var disablemap=[];      // map of disabled numbers
var number_state=[];    // for right toggling of the numbers

var icon=[];
icon["heart.0"]="--x---x---"
icon["heart.1"]="-xxx-xxx--"
icon["heart.2"]="xxxxxxxxx-"
icon["heart.3"]="xxxxxxxxx-"
icon["heart.4"]="-xxxxxxx--"
icon["heart.5"]="-xxxxxxx--"
icon["heart.6"]="--xxxxx---"
icon["heart.7"]="---xxx----"
icon["heart.8"]="---xxx----"
icon["heart.9"]="----x-----"
icon["heart.10"]="----------"

// profiles
var profiles=[];
var current_profile=""

var starttime=new Date();
var a=0;
var b=0;
var avg=0;              // current avg timing

var progress_update=0;
var taskcounter=0;
var task_target=0;

var ultimate_goal=0;
var good_goal=0;


var last_bad=-1;

function load_from_storage(name, def_value) {
    var value=localStorage.getItem(name)
    if ( value == null ) {
        console.log("load_from_storage: default["+name+"] = " + def_value)
        localStorage.setItem(name,def_value)
        return def_value
    } else {
        console.log("load_from_storage: load["+name+"] = " + value)
        return value
    }
}

profiles=JSON.parse(load_from_storage("profiles",JSON.stringify([ "default" ])))
current_profile=profiles[0]
console.log(profiles)
console.log("current-profile:" + current_profile)

function set_map(to) {
    console.log("set_map to="+to)
    var count=0;
    for (let x = 0; x <= 10; x++) {
        for (let y = 0; y <= 10; y++) {
            bettermap[x+"."+y]=undefined
            if ( to == "load" ) {
                // load from storage
                value=parseInt(load_from_storage(x+"."+y,0))
                count++
            } else if ( to == "reset" ) {
                // set to 0
                value=0
                count++
            } else if ( to == "random" ) {
                // set to random values
                value=Math.round(Math.random()*25000+ultimate_goal*1.2)
                count++
            } else if ( to == "degen" ) {
                if ( map[x+"."+y] > ultimate_goal && disablemap[current_profile+"."+x+"."+y] == 0) {
                    value=Math.round(map[x+"."+y]*1.05)
                    if ( value == map[x+"."+y] ) { value++ }
                    console.log("degen: "+x+"."+y+" from "+map[x+"."+y]*1.05+" to "+value)
                    count++
                } else {
                    value=map[x+"."+y]
                }
            }
            map[x+"."+y]=value
            localStorage.setItem(x+"."+y,value)
            localStorage.setItem(current_profile+"."+x+"."+y,value)
        } 
    } 
    return count    
}

set_map("load")

var show_timeout="load";

function set_show_timeout() {

    console.log("set_show_timeout")
    var next_show_timeout=load_from_storage("show_timeout","on")
    if ( show_timeout == "load" ) {
        // load first time
        show_timeout=next_show_timeout
    } else {
        if ( show_timeout == "on" ) {
            next_show_timeout="off"
        } else {
            next_show_timeout="on"
        }
    }
    show_timeout=next_show_timeout

    if ( show_timeout == "on" ) {
        $("#timeouttable").show()
    } else {
        $("#timeouttable").hide()
    }
    localStorage.setItem("show_timeout",show_timeout)
    $("#show_timeout").html("<lang>"+show_timeout+"</lang>")
    render_lang($("#show_timeout"))

}

function set_goal() {
    if ( ultimate_goal == 0 ) {
        // load first time
        var value=load_from_storage("ultimate_goal","5000")
    } else {
        var value=$("#ultimate_goal_input").val();
    }
    ultimate_goal=value
    localStorage.setItem("ultimate_goal",value)
    $("#ultimate_goal_input").val(ultimate_goal)

    if ( ultimate_goal > 9999 ) {
        $("#perfect_goal").html("&lt;"+Math.ceil(ultimate_goal/1000)+"s")
    } else {
        $("#perfect_goal").html("&lt;"+ultimate_goal+"ms")
    }
    console.log("set_goal to " + ultimate_goal)
    rendermap()
}

function set_task_target() {
    if ( task_target == 0 ) {
        // load first time
        var value=load_from_storage("task_target",100)
    } else {
        var value=$("#task_target_input").val();
    }
    task_target=value
    $("#task_target_input").val(task_target)
    localStorage.setItem("task_target",value)
    console.log("set task_target to " + value)
}

function reset() {
    set_map("reset")
    rendermap()
}

function random() {
    set_map("random")
    rendermap()
}


function update_avg() {
    var v=0; // value sum
    var c=0; // counter
    for (let y = 0; y <= 10; y++) {
        for (let x = 0; x <= 10; x++) {
            if (map[x+"."+y] > 0 && disablemap[current_profile+"."+x+"."+y] == 0) {
               localStorage.setItem(x+"."+y,map[x+"."+y])
               v+=map[x+"."+y]
               c++
            }
        } 
    } 
    avg=(1.0*v)/c;
    console.log("avg update to "+avg)
}

function getavg() {

    update_avg()

    if ( avg*1.2 < ultimate_goal ) {
        // does not make avg harder than ultimate-goal
        good_goal=Math.ceil(ultimate_goal*1.2)
    } else {
        good_goal=Math.ceil(avg*1.2)

    }
    console.log("good_goal set to:" + good_goal)
    if ( good_goal > 9999 ) {
        $("#good_goal").html("&lt;"+Math.ceil(good_goal/1000)+"s")
        $("#improvable_goal").html("&gt;"+Math.ceil(good_goal/1000)+"s")
    } else {
        $("#good_goal").html("&lt;"+good_goal+"ms")
        $("#improvable_goal").html("&gt;"+good_goal+"ms")
    }
    
}

function toggle_disable(number) {
    if ( number_state[number] == undefined ) {
        number_state[number] = "on"
    }

    var target_state=0
    if ( number_state[number] == "on" ) {
        target_state=1
        number_state[number] = "off"
    } else {
        target_state=0
        number_state[number] = "on"
    }

    for (let y = 0; y <= 10; y++) {
        for (let x = 0; x <= 10; x++) {
            if ( x == number | y == number ) {
                disablemap[current_profile+"."+x+"."+y]=target_state
            }
        }
    }
    rendermap()
}

function rendermap() {

    console.log("rendermap...")
    getavg();

    str="<table class='table'>"
    str+="<tr><td></td>"
    for (let x = 0; x <= 10; x++) {
        str+="<td class='text-center'>"
        if ( number_state[x] == "off" ) {
            str+="<button class=\"btn btn-secondary shadow btn-sm btn-block\" type='button' onclick=\"toggle_disable('"+x+"')\" id=\"toggle_"+x+"\">"+x+"</button>"

        } else {
            str+="<button class=\"btn btn-default shadow btn-sm btn-block\" type='button' onclick=\"toggle_disable('"+x+"')\" id=\"toggle_"+x+"\">"+x+"</button>"
        }
        str+="</td>"
    } 
    str+="</tr>"
    var better=0
    var perfect=0
    var good=0

    for (let y = 0; y <= 10; y++) {
        str+="<tr><td class='text-center'>"+y+"</td>"
        for (let x = 0; x <= 10; x++) {
            if ( disablemap[current_profile+"."+x+"."+y] == undefined ) {
                disablemap[current_profile+"."+x+"."+y]=0
            }
            if ( disablemap[current_profile+"."+x+"."+y] == 0 ) {
                if ( ( map[x+"."+y] <= ultimate_goal ) & ( map[x+"."+y] > 0) ) {
                    // perfect
                    perfect++
                    if ( bettermap[x+"."+y] == undefined ) {
                        bettermap[x+"."+y]=2
                    }
                    if ( bettermap[x+"."+y] == 2 ) {
                        // first time during loading
                        str+="<td class='text-center'><i class='bi bi-emoji-laughing-fill text-success'></i></td>"
                    } else {
                        // step up!!!
                        str+="<td class='text-center text-bg-info'><i class='bi bi-emoji-laughing-fill text-success'></i></td>"
                    }
                } else if ( map[x+"."+y] <= good_goal ) {
                    if ( bettermap[x+"."+y] == undefined ) {
                        bettermap[x+"."+y]=1
                    }
                    if ( bettermap[x+"."+y] == 1 ) {
                        // first time during loading
                        str+="<td class='text-center'><i class='bi bi-emoji-smile-fill text-info'></i></td>"
                    } else {
                        // step up!!!
                        str+="<td class='text-center text-bg-secondary'><i class='bi bi-emoji-smile-fill text-info'></i></td>"
                    }
                    // good
                    good++
                } else {
                    if ( bettermap[x+"."+y] == undefined ) {
                        bettermap[x+"."+y]=0
                    }
                    // cloud be better
    //                str+="<td style='background-color: white; border: 1px solid black; border-radius: 10px;'>"+map[x+"."+y]+"</td>"
                    str+="<td class='text-center'><i class='bi bi-emoji-smile-fill text-warning'></i></td>"
                    better++
                }
            } else {
                str+="<td class='text-center shadow-lg text-bg-secondary-emphasis'><i class='bi bi-pause-btn-fill text-secondary'></i></td>"
            }
        } 
        str+="</tr>"
    } 
    str+="</table>"

    $("#map").html(str)
    $("#state_again").html( Math.round(better*100/(better+good+perfect)) + "%" )
    $("#state_good").html( Math.round(good*100/(better+good+perfect)) + "%" )
    $("#state_perfect").html( Math.round(perfect*100/(better+good+perfect)) + "%" )
    console.log("...rendermap")

}

function renderbuttons(iconname) {


    str="<table class='table table-sm'>"

    for (let y = 0; y <= 10; y++) {
        str+="<tr>"
        for (let x = 0; x < 10; x++) {
            number=x+y*10
            if ( number > 100 ) { number=100 }
            if ( iconname == undefined ) {
                str+="<td class='text-center col-md-1'><button class=\"btn btn-primary btn-sm btn-block\" type='button' onclick=\"set_input('"+number+"')\" id=\""+number+"\">"+number+"</button></td>"
            } else {
                if ( icon[iconname+"."+y] == undefined ) {
                    str+="<td class='text-center col-md-1'><button class=\"btn btn-danger btn-sm btn-block\" type='button' onclick=\"set_input('"+number+"')\" id=\""+number+"\">"+number+"</button></td>"
                } else {
                    if ( icon[iconname+"."+y][x] == "-" ) {
                        str+="<td class='text-center col-md-1'><button class=\"btn btn-default btn-sm btn-block\" type='button' onclick=\"set_input('"+number+"')\" id=\""+number+"\">"+number+"</button></td>"
                    } else {
                        str+="<td class='text-center col-md-1'><button class=\"btn btn-success btn-sm btn-block\" type='button' onclick=\"set_input('"+number+"')\" id=\""+number+"\">"+number+"</button></td>"
                    }
                }
            }
        } 
        str+="</tr>"
    } 
    str+="</table>"

    $("#inputbuttons").html(str)

}

function update_taskcounter() {
    $("#taskcounter").html(taskcounter+"/"+task_target)   
}

function goal_reached() {
    console.log("goal_reached")
    // TODO: Goal reached dialog...
    renderbuttons("heart")
    setTimeout(renderbuttons,2000)
    if ( taskcounter == task_target ) {
        $("#task_goal_reached").html("<div class='alert alert-success' role='alert'>"+taskcounter+"/"+task_target+"</div>")
    } else {
        $("#task_goal_reached").html("<div class='alert alert-primary' role='alert'>"+taskcounter+"/"+task_target+"</div>")
    }

    var ultimate_per = $("#state_perfect").html()
    if ( ultimate_per == 100 ) {
        $("#ultimte_goal_reached").html("<div class='alert alert-success' role='alert'>"+ultimate_per+"</div>")
    } else {
        $("#ultimte_goal_reached").html("<div class='alert alert-primary' role='alert'>"+ultimate_per+"</div>")
    }

    $("#goal_reached").modal("show")
}

function next() {

    // prepare next task and cleanup last

    // update taskcounter.
    update_taskcounter()
    if (taskcounter == task_target) {
        // task goal reached
        console.log("task target reached")
        goal_reached();
        return
    }

    // clean last help for right result
    $("#"+last_bad).removeClass("btn-success")

    // find next tasks
    var found=0
    for (let x = 0; x <= 10; x++) {
        for (let y = 0; y <= 10; y++) {
            if ( disablemap[current_profile+"."+x+"."+y] == 0 && map[x+"."+y] == 0) {
                value=x+"x"+y;
                a=x
                b=y
                found=1
                break 
            }
        } 
    }
    console.log("next L1 found="+found) 

    // if found=0
    if (found == 0 ) {
        getavg();
        max=0
        // find task with highest times needed
        for (let y = 0; y <= 10; y++) {
            for (let x = 0; x <= 10; x++) {
                if ( (map[x+"."+y] > max) && (map[x+"."+y] > ultimate_goal) && disablemap[current_profile+"."+x+"."+y] == 0 ) {
                    value=x+"x"+y;
                    a=x
                    b=y
                    max=map[x+"."+y]
                    found=1
                }
            } 
        } 
    }

    console.log("next L2 found="+found) 

    // if found=0
    if (found == 0 ) {
       var degencount=set_map("degen")
       console.log("degencount:"+degencount)
       rendermap()
       if ( degencount == 0 ) {
            clearTimeout(progress_update)
            $("#"+last_bad).removeClass("btn-success")
            console.log("DONE! all in perfect!")
            goal_reached();
            return
       }
       setTimeout(next,500)
       return
    }

    var x=document.getElementById("task");
    x.innerHTML='<font size="+5">'+value+'</font>'
    rendermap();

    starttime=new Date();
    console.log("new task startime: "+starttime.getTime())

    clearTimeout(progress_update)
    setTimeout(set_progress,100)
    
      
}

function set_progress() {

    var x=document.getElementById("timeout");

    var resulttime=new Date();
    var tasktime=(resulttime.getTime()-starttime.getTime()) // time in ms.

    // 0-25% = 0-perfect
    if ( tasktime < ultimate_goal ) {
        per=tasktime/ultimate_goal * 25
    } else if ( tasktime < avg*1.2 ) {
    // 26-75% = perfect - avg*1.2
        per=tasktime/(avg*1.2) * 50 + 25
    } else {
    // 76-100% = avg*1.2 - ?
        per=(tasktime-avg*1.2)/(avg*1.2) * 25 + 75
    }

    if ( tasktime > 0 ) { x.style.width=per+"%" }

    if ( per < 100 ) { 
        progress_update=setTimeout(set_progress,500)
   } else {
        $("#"+a*b).addClass("btn-success")
        last_bad=a*b
   }

}

function reset_button(id) {
    console.log("reset_button: "+id)
    $("#"+id).removeClass("btn-success")
    next()
}


function set_input(value) {

    if ( value == undefined ) {
        value=$("#enter").val();
        $("#enter").val("")
    }

    var x=document.getElementById("input");

    var resulttime=new Date();
    var tasktime=(resulttime.getTime()-starttime.getTime()) // time in ms.
    $("#reaction_time").html(tasktime+"ms")
    if ( a*b == value ) {
        // right
        map[a+"."+b]=tasktime;
        taskcounter++
        next()
    } else {
        $("#"+a*b).addClass("btn-success")
        last_bad=a*b
    }
    
}

function update_goals() {
    console.log("update goals")
    set_task_target()
    set_goal()
    $('#setgoals').modal("hide")
}

function init() {
    set_show_timeout()
    set_task_target()
    set_goal()
    renderbuttons()
    render_lang()
}
// alert("hellow world")