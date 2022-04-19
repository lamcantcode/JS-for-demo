// ==UserScript==
// @name         race card
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Capture upcoming race card
// @author       Lam
// @run-at       document-end
// @match        https://racing.hkjc.com/racing/information/Chinese/racing/RaceCard.aspx*
// @iconURL      https://racing.hkjc.com/image/common/logo_80x70.jpg
// @grant        none
// ==/UserScript==

// global variables
const my_ip = "http://127.0.0.1:8000";

// race_content included Race number, date, race lenght etc
const race_content = document.getElementsByClassName("f_fs13")[0].innerHTML.split('<br>');

// Global variables to indicate whether data are persisted into database successfully
let number_of_race_horse_object_to_persist = 0;
let number_of_race_horse_object_persisted = 0;


const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = 'json';

    if (data) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject('Something went wrong!');
    };

    xhr.send(JSON.stringify(data));
  });
    return promise;``
};


let check_whether_all_data_persisted = () => {
    // This function checks whether all data are persisted sucessfully
    if (number_of_race_horse_object_persisted == number_of_race_horse_object_to_persist) {
        console.log("Checking: All data are persisted into database?\nResult: true");
        return true;
    }
    console.log("Checking: All data are persisted into database?\nResult: false");
    return false;
}


let get_current_time = () =>{
  var today = new Date();
  var current_time = today.toString().substring(16, 24);
  return "[" + current_time + "]";
}


let get_date = (race_content) => {
  // Convert the date from chinese date to yyyy-mm-dd
  race_content = race_content[1].split(", ")[0]
  var chinese =/[\u4e00-\u9fa5]/g;
  race_content = race_content.replace(chinese, ",");
  race_content = race_content.split(",");

  var day =  race_content[2];
  var month = race_content[1];
  var year  = race_content[0];
  if(Number(day)<10){
    day = "0"+day;
  }
  if(Number(month)<10){
    month = "0"+month;
  }
    return year+"-"+month+"-"+day;
}


let get_venue = (race_content) => {
  return (race_content[1].split(", ")[2] == "\u6c99\u7530")? "ST" : "HV";
}


let get_race_num = () => {
  // This function get the race number from the url last number
  var race_num = window.location.href.split('=').pop();
  if(race_num == "https://racing.hkjc.com/racing/information/Chinese/racing/RaceCard.aspx"){
    race_num = Number(1);
  }
  return race_num;
}


let get_race_time = (race_content, race_date) => {
  // This function get the race time and convert it to the YYYYMMDDhh24miss format
  var race_time = race_content[1].split(", ")[3];
  race_date = race_date.replaceAll("-","") ;
  return race_date + race_time.replace(":","") + "00";
}

let format_race_prize = (money) => {
  // Change the money format from $123,456 to 123456
  money = money.replaceAll(",","");
  money = money.replace("$","");
  return Number(money);
}

let remove_string = (string, remove) => {
  // This function can remove the character or sting, e.g. remove_string("hell.o", ".") -----> result: hello
  for(let x in remove){
    string = string.replace(remove[x],"");
  }
  return string;
}


let check_scratched = (current_horse) => {
  // This function can check the horse is scratched or not, and return a boolean
  return document.querySelector(`#racecardlist > tbody > tr > td > table > tbody > tr:nth-child(${current_horse}) > td:nth-child(4) > span`) != null;
}


let check_apprentice_allowance = (current_horse) => {
    // This function can check the check apprentice allowance exist or not, if exist return allowance value
  var allowance = document.querySelector(`#racecardlist > tbody > tr > td > table > tbody > tr:nth-child(${current_horse}) > td:nth-child(7) > a`).innerText.match(/(\d+)/)
  if(allowance != null){
    return document.querySelector(`#racecardlist > tbody > tr > td > table > \
    tbody > tr:nth-child(${current_horse}) > td:nth-child(7) > a`).innerText.match(/(\d+)/)[0];
  }
  else{
    return null;
  }
}


let extract_priority = (race_horse_object, unextract_priority) => {
  // This function can extract the priority from unextract priority
  // "+" = trump_card
  // "*" = priority
  if(unextract_priority.includes('+')){
    race_horse_object["trump_card"] = "Y";
  }
  if(unextract_priority.includes('*')){
    race_horse_object["priority"] = "Y";
  }
  if(unextract_priority.match(/(\d+)/)!=null){
    race_horse_object["preference"] = unextract_priority.match(/(\d+)/)[0];
  }
}


let ground_condition_exist = (race_content) => {
  // This function can check ground condition exist or not
  if(race_content[2].split(',').length==4){
    return race_content[2].split(", ")[3];
  }
}


let get_total_horse_count_upper = () => {
  // This function can get the total number of race horses from upper table
  return document.querySelector("#racecardlist > tbody > tr > td > table").rows.length;
}


let get_total_horse_count_lower = () => {
  // This function can get the total number of race horses from lower table
  return document.getElementsByClassName("bg_white f_tac f_fs13").length;
}

let next_page = (race_profile_json) =>{
  // This function can go to the next page if the current race number isn't the last one
  // If the current race number is the last one, it will wait a few seconds and go the first race
  var total_race_num =document.getElementsByClassName("f_fs12 f_fr js_racecard")[0].rows[0].cells.length-1;
  if(race_profile_json["race_num"]!=total_race_num){
    location.replace(`https://racing.hkjc.com/racing/information/Chinese/racing/RaceCard.aspx?RaceDate=\
    ${race_profile_json["race_date"].replaceAll("-","/")}&Racecourse=${race_profile_json["race_venue"]}&RaceNo=${Number(race_profile_json["race_num"])+1}`);
  }
  else{
    setTimeout(()=>{
      location.replace(`https://racing.hkjc.com/racing/information/Chinese/racing/RaceCard.aspx?RaceDate=\
      ${race_profile_json["race_date"].replaceAll("-","/")}&Racecourse=${race_profile_json["race_venue"]}&RaceNo=1`)}
      , 100);
  }
}


let fetch_race_profile = () =>{
  // This function can fetch race profile and return a race_profile_object
  var race_profile_object = {
  "race_date": null,
  "race_venue": null,
  "race_num": null,
  "race_name": null,
  "race_time": null,
  "race_prize" : null,
  "race_class": null,
  "race_ground": null,
  "race_track": null,
  "race_length": null,
  "race_ground_condition": null
  }

  race_profile_object["race_date"] = get_date(race_content);
  race_profile_object["race_venue"] = get_venue(race_content);
  race_profile_object["race_num"] = get_race_num();
  race_profile_object["race_name"] = document.getElementsByClassName("font_wb")[0].innerText.split(' ').pop();
  race_profile_object["race_time"] = get_race_time(race_content, race_profile_object["race_date"]);
  race_profile_object["race_prize"] = race_content[3].split(' ')[1];
  race_profile_object["race_prize"] = format_race_prize(race_profile_object["race_prize"]);
  race_profile_object["race_class"] = race_content[3].split(' ').pop();
  var item_length = race_content[2].split(", ").length;
  var diff = 0;
  if(item_length == 2){
    var diff = 1;
  }
  race_profile_object["race_ground_condition"] = ground_condition_exist(race_content);
  race_profile_object["race_ground"] = race_content[2].split(", ")[0];
  if(diff!=1){
  race_profile_object["race_track"] = race_content[2].split(", ")[1];
  race_profile_object["race_track"] = remove_string(race_profile_object["race_track"],['"','" \u8cfd\u9053']);}
  race_profile_object["race_length"] = race_content[2].split(", ")[2-diff];
  race_profile_object["race_length"] = Number(race_profile_object["race_length"].replace("\u7c73",""));

  return race_profile_object;
}


let race_horse_profile_upper_table = (current_horse) =>{
  // This function can fetch race horse profile from upper table and return a race_horse_object
  var race_horse_object = {
  "race_date": null,
  "race_venue":null ,
  "race_num": null,
  "horse_num":null,
  "draw_num": -99 ,
  "horse_code": null,
  "horse_name": null,
  "jockey_code":null ,
  "jockey_name": null,
  "trainer_code":null ,
  "trainer_name": null,
  "horse_weight": null,
  "horse_handicap_weight": null,
  "horse_runner_rating":null,
  "horse_rating_change":null,
  "horse_gear":null ,
  "saddle_cloth": null,
  "standby_status": "N",
  "apprentice_allowance": null,
  "scratched": null,
  "scratched_group": null,
  "members": "{}",
  "priority": "N",
  "trump_card": "N",
  "preference": null}

  number_of_race_horse_object_to_persist += 1;

  const racecardlist = `#racecardlist > tbody > tr > td > table > tbody > tr:nth-child(${current_horse})`
  race_horse_object["race_date"] = get_date(race_content);
  race_horse_object["race_venue"] = get_venue(race_content);
  race_horse_object["race_num"] = get_race_num();
  race_horse_object["scratched"] = check_scratched(current_horse);
  race_horse_object["scratched_group"] = race_horse_object["scratched"];
  race_horse_object["horse_num"] = document.querySelector(`${racecardlist} > td:nth-child(1)`).textContent;
  race_horse_object["horse_code"] = document.querySelector(`${racecardlist} > td:nth-child(4) > a`).href;
  race_horse_object["horse_code"] = race_horse_object["horse_code"].split('_').pop();
  race_horse_object["horse_name"] = document.querySelector(`${racecardlist} > td:nth-child(4) > a`).innerText;
  if(!race_horse_object["scratched"]){
    race_horse_object["draw_num"] = document.querySelector(`${racecardlist} > td:nth-child(9)`).textContent;
    race_horse_object["jockey_code"] = document.querySelector(`${racecardlist} > td:nth-child(7) > a`).href;
    race_horse_object["jockey_code"] = race_horse_object["jockey_code"].split('=').pop();
    race_horse_object["jockey_name"] = document.querySelector(`${racecardlist} > td:nth-child(7) > a`).innerText;
    race_horse_object["jockey_name"] = race_horse_object["jockey_name"].replace(/[^\u4E00-\u9FA5]/g,'');
    race_horse_object["trainer_code"] = document.querySelector(`${racecardlist} > td:nth-child(10) > a`).href;
    race_horse_object["trainer_code"] = race_horse_object["trainer_code"].split('=').pop()
    race_horse_object["trainer_name"] = document.querySelector(`${racecardlist} > td:nth-child(10) > a`).innerText;
    race_horse_object["horse_weight"] = document.querySelector(`${racecardlist} > td:nth-child(14)`).innerText;
    race_horse_object["horse_weight"] = Number(race_horse_object["horse_weight"]);
    race_horse_object["horse_handicap_weight"] = document.querySelector(`${racecardlist} > td:nth-child(6)`).innerText;
    race_horse_object["horse_handicap_weight"] = Number(race_horse_object["horse_handicap_weight"]);
    race_horse_object["horse_runner_rating"] = document.querySelector(`${racecardlist} > td:nth-child(12)`).innerText;
    race_horse_object["horse_gear"] = document.querySelector(`${racecardlist} > td:nth-child(22)`).innerText;
    race_horse_object["horse_rating_change"] = document.querySelector(`${racecardlist} > td:nth-child(13)`).innerText;
    race_horse_object["apprentice_allowance"] = check_apprentice_allowance(current_horse);

    var unextract_priority = document.querySelector(`${racecardlist} > td:nth-child(21)`).innerText;
    extract_priority(race_horse_object,unextract_priority);

  }

  return race_horse_object;
}


let race_horse_profile_lower_table = (current_horse) =>{
  // This function can fetch race horse profile from lower table(Stand-by horse) and return a race_horse_object
  var race_horse_object = {
    "race_date": null,
    "race_venue":null ,
    "race_num": null,
    "horse_num":null,
    "draw_num": null ,
    "horse_code": null,
    "horse_name": null,
    "jockey_code":null ,
    "jockey_name": null,
    "trainer_code":null ,
    "trainer_name": null,
    "horse_weight": null,
    "horse_handicap_weight": null,
    "horse_runner_rating":null,
    "horse_rating_change":null,
    "horse_gear":null ,
    "saddle_cloth": null,
    "standby_status": "Y",
    "apprentice_allowance": null,
    "scratched": null,
    "scratched_group": null,
    "members": "{}",
    "priority": "N",
    "trump_card": "N",
    "preference": null}

  number_of_race_horse_object_to_persist += 1;
  const standbylist = `#standbylist > tbody > tr:nth-child(${current_horse})`;

  race_horse_object["race_date"] = get_date(race_content);
  race_horse_object["race_venue"] = get_venue(race_content);
  race_horse_object["race_num"] = get_race_num();
  race_horse_object["horse_num"] = document.querySelector(`${standbylist} > td:nth-child(1)`).textContent*-1;
  race_horse_object["horse_code"] = document.querySelector(`${standbylist}  > td:nth-child(2) > a`).href.split('_').pop();
  race_horse_object["horse_name"] = document.querySelector(`${standbylist}  > td:nth-child(2)`).innerText;
  race_horse_object["horse_weight"] = document.querySelector(`${standbylist}  > td:nth-child(3)`).innerText;
  race_horse_object["horse_weight"] = Number(race_horse_object["horse_weight"]);
  race_horse_object["horse_handicap_weight"] = document.querySelector(`${standbylist}  > td:nth-child(4)`).innerText;
  race_horse_object["horse_handicap_weight"] = Number(race_horse_object["horse_handicap_weight"]);
  race_horse_object["horse_runner_rating"] = document.querySelector(`${standbylist}  > td:nth-child(5)`).innerText;
  race_horse_object["trainer_name"] = document.querySelector(`${standbylist}  > td:nth-child(8) > a`).textContent;
  race_horse_object["trainer_code"] = document.querySelector(`${standbylist}  > td:nth-child(8) > a`).href.split('=').pop();
  var unextract_priority = document.querySelector(`${standbylist}  > td:nth-child(9)`).textContent;
  extract_priority(race_horse_object,unextract_priority);
  race_horse_object["horse_gear"] = document.querySelector("#standbylist > tbody > tr.bg_white.f_tac.f_fs13 > td:nth-child(10)".innerText);
  return race_horse_object;
}


function start(){
  'use strict';
  number_of_race_horse_object_persisted = 0;
  number_of_race_horse_object_to_persist = 0;

  console.log(get_current_time() + " Trying to capture current race horse profile and race profile.");

  //race_profile
  var race_profile_json = fetch_race_profile();

  //race_horse_profile
    //upper horse table
  var count_total_horse = get_total_horse_count_upper();
  for(var current_horse=1;current_horse<count_total_horse;current_horse++){
    var race_horse_json = race_horse_profile_upper_table(current_horse);
    sendHttpRequest('POST', `${my_ip}/api/v1/race_horse_profile/`, race_horse_json)
        .then(responseData => {
          console.log(responseData);
          number_of_race_horse_object_persisted += 1;
        })
        .catch(err => {
          console.log(err);
          location.reload();
        });
  }

    //lower horse table(Stand-by Starter)
  var count_total_Standby = get_total_horse_count_lower();
  if(count_total_Standby != 0){
    for(current_horse=2;current_horse<count_total_Standby+2;current_horse++){
      race_horse_json = race_horse_profile_lower_table(current_horse);

      sendHttpRequest('POST', `${my_ip}/api/v1/race_horse_profile/`, race_horse_json)
        .then(responseData => {
          console.log(responseData);
          number_of_race_horse_object_persisted += 1;
        })
        .catch(err => {
          console.log(err);
          location.reload();
        });
  }}
  // race_profile
  sendHttpRequest('POST', `${my_ip}/api/v1/race_profile/`, race_profile_json)
        .then(responseData => {
          console.log(responseData);
          setTimeout(()=>{
          if(check_whether_all_data_persisted()){
          next_page(race_profile_json);}
          else{
            location.reload();
          }
        },200)
        })
        .catch(err => {
          console.log(err);
          location.reload();
        });

      };



if(window.location.href.includes("racing.hkjc.com/")){
// it can prevent go next when testing
  start();
}
