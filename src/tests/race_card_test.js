// testing the format_race_prize function
describe("Get the correct extract race prize", () => {
    var prize = format_race_prize("$1,000,000");

    it("should be 1000000", () =>{
        expect(prize).toBe(1000000);
    });

    it("should be a int", () =>{
        expect(typeof(prize)).toBe("number");
    });
});


// testing the check_whether_all_data_persisted function
describe("Check whether all data persisted", () => {
    var all_perisited = check_whether_all_data_persisted();

    it("should be true", () =>{
        expect(all_perisited).toBe(true);
    });

    number_of_race_horse_object_persisted += 1;
    var not_perisited = check_whether_all_data_persisted();
    it("should be false", () =>{
        expect(not_perisited).toBe(false);
    });

    var not_perisited = check_whether_all_data_persisted();
    it("should be boolean", () =>{
        expect(typeof(not_perisited)).toBe("boolean");
    });
});


// testing the get_date function
describe("Check the get_date function", () => {
    var date = get_date(race_content);

    it("should be '2022-02-16'", () =>{
        expect(date).toBe("2022-02-16");
    });

    it("should be a string", () =>{
        expect(typeof(date)).toBe("string");
    });
});


// testing the get_date function
describe("Check the get venue function", () => {
    var date = get_venue(race_content);

    it("should be 'HV'", () =>{
        expect(date).toBe("HV");
    });
});


// testing the get_race_time function
describe("Check the race number function", () => {
    var race_date = get_date(race_content);
    var race_time = get_race_time(race_content, race_date);
    it("should be '20220216221500'", () =>{
        expect(race_time).toBe('20220216221500');
    });
    it("should be a string", () =>{
        expect(typeof(race_time)).toBe("string");
    });
});


// testing the remove_string function
describe("Check the remove string function", () => {
    var string1 = "t=esti-ng/";
    var string2 = "ra_ce c;a*rd";

    string1 = remove_string(string1, ["=","-","/"]);
    string2 = remove_string(string2, ["_",";","*"]);
    it("should be 'testing'", () =>{
        expect(string1).toBe('testing');
    });

    it("should be 'race card'", () =>{
        expect(string2).toBe('race card');
    });
});

// testing the check_scratched function
describe("Check the check scratched function", () => {
    var horse1 = check_scratched(1);
    var horse2 = check_scratched(2);

    it("should be true", () =>{
        expect(horse1).toBeTrue();
    });

    it("should be false", () =>{
        expect(horse2).toBeFalse();
    });
});


// testing the check_apprentice_allowance function
describe("Check the check apprentice allowance function", () => {
    var horse1 = check_apprentice_allowance(8);
    var horse2 = check_apprentice_allowance(2);

    it("horse 8 should be '2'", () =>{
        expect(horse1).toBe("2");
    });
    it("horse 2 be null", () =>{
        expect(horse2).toBe(null);
    });
});


let create_race_horse_object = () => {
    const race_horse_object = {
        "priority": "N",
        "trump_card": "N",
        "preference": null}

    return race_horse_object;
}


// testing the extract_priority function
describe("Check the extract priority function", () => {
    var race_horse_object1 = create_race_horse_object();
    var race_horse_object2 = create_race_horse_object();
    var race_horse_object3 = create_race_horse_object();

    extract_priority(race_horse_object1,"+ 1");
    extract_priority(race_horse_object2,"* 2");
    extract_priority(race_horse_object3,"3");

    // extract race_horse_object1
    it("should be 'Y'", () =>{
        expect(race_horse_object1["trump_card"]).toBe("Y");
    });
    it("should be 'N'", () =>{
        expect(race_horse_object1["priority"]).toBe("N");
    });
    it("should be '1'", () =>{
        expect(race_horse_object1["preference"]).toBe("1");
    });

    // extract race_horse_object2
    it("should be 'N'", () =>{
        expect(race_horse_object2["trump_card"]).toBe("N");
    });
    it("should be 'Y'", () =>{
        expect(race_horse_object2["priority"]).toBe("Y");
    });
    it("should be '2'", () =>{
        expect(race_horse_object2["preference"]).toBe("2");
    });

    // extract race_horse_object3
    it("should be 'N'", () =>{
        expect(race_horse_object3["trump_card"]).toBe("N");
    });
    it("should be 'N'", () =>{
        expect(race_horse_object3["priority"]).toBe("N");
    });
    it("should be '3'", () =>{
        expect(race_horse_object3["preference"]).toBe("3");
    });
});


// testing the ground_condition_exist function
describe("Check the ground condition exist or not", () => {
    var ground_condition = ground_condition_exist(race_content);
    it("should be '\u597d\u5730'", () =>{
        expect(ground_condition).toBe("\u597d\u5730");
    });
});


// This function can compare two objects for each key value
let compare_two_objects = (object, test_object) => {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            expect(object[key]).toBe(test_object[key]);
        }
    }
}


// testing the fetch_race_profile function
describe("Check the fetch race profile function", () => {
    var race_profile = fetch_race_profile();
    race_profile["race_num"] = "1";
    var race_profile_testing_object = {
        "race_date": "2022-02-16",
        "race_venue": "HV",
        "race_num": "1",
        "race_name": "雪松讓賽",
        "race_time": "20220216221500",
        "race_prize": 1570000,
        "race_class": "第三班",
        "race_ground": "草地",
        "race_track": "C",
        "race_length": 1200,
        "race_ground_condition": "好地"
        }
    it("should a correct race_profile object", () => {
        compare_two_objects(race_profile, race_profile_testing_object);
    });

    it("should not be null", () => {
        expect(JSON.stringify(race_profile)==null).toBeFalse();
    });
});


// testing the race_horse_profile_upper_table function
describe("Check the fetch race horse profile(upper table) function", () => {
    var race_horse_profile1 = race_horse_profile_upper_table(1);
    var race_horse_profile2 = race_horse_profile_upper_table(8);
    race_horse_profile1["race_num"] = "1";
    race_horse_profile2["race_num"] = "1";
    var race_profile_testing_object1 = {
        "race_date": "2022-02-16",
        "race_venue": "HV",
        "race_num": "1",
        "horse_num": "1",
        "draw_num": -99,
        "horse_code": "D024",
        "horse_name": "以戰養戰",
        "jockey_code": null,
        "jockey_name": null,
        "trainer_code": null,
        "trainer_name": null,
        "horse_weight": null,
        "horse_handicap_weight": null,
        "horse_runner_rating": null,
        "horse_rating_change": null,
        "horse_gear": null,
        "saddle_cloth": null,
        "standby_status": "N",
        "apprentice_allowance": null,
        "scratched": true,
        "scratched_group": true,
        "members": "{}",
        "priority": "N",
        "trump_card": "N",
        "preference": null
    }
    var race_profile_testing_object2 = {
        "race_date": "2022-02-16",
        "race_venue": "HV",
        "race_num": "1",
        "horse_num": "8",
        "draw_num": "14",
        "horse_code": "E090",
        "horse_name": "駿益善",
        "jockey_code": "PMF",
        "jockey_name": "潘明輝",
        "trainer_code": "SCS",
        "trainer_name": "沈集成",
        "horse_weight": 1215,
        "horse_handicap_weight": 119,
        "horse_runner_rating": "66",
        "horse_rating_change": "0",
        "horse_gear": "B",
        "saddle_cloth": null,
        "standby_status": "N",
        "apprentice_allowance": "2",
        "scratched": false,
        "scratched_group": false,
        "members": "{}",
        "priority": "N",
        "trump_card": "Y",
        "preference": "1"
}
    it("should a correct race_horse_profile object", () => {
        compare_two_objects(race_horse_profile1, race_profile_testing_object1);
    });
    it("should a correct race_horse_profile object", () => {
        compare_two_objects(race_horse_profile2, race_profile_testing_object2);
    });
});



// testing the race_horse_profile_lower_table function
describe("Check the fetch race horse profile(lower tabl) function", () => {
    var race_horse_profile = race_horse_profile_lower_table(2);
    race_horse_profile["race_num"] = "1";
    var race_horse_profile_testing_object = {
    "race_date": "2022-02-16",
    "race_venue": "HV",
    "race_num": "1",
    "horse_num": -1,
    "draw_num": null,
    "horse_code": "E457",
    "horse_name": "勝利之皇",
    "jockey_code": null,
    "jockey_name": null,
    "trainer_code": "SWY",
    "trainer_name": "蘇偉賢",
    "horse_weight": 0,
    "horse_handicap_weight": 114,
    "horse_runner_rating": "61",
    "horse_rating_change": null,
    "horse_gear": null,
    "saddle_cloth": null,
    "standby_status": "Y",
    "apprentice_allowance": null,
    "scratched": null,
    "scratched_group": null,
    "members": "{}",
    "priority": "N",
    "trump_card": "N",
    "preference": "1"
}
    it("should a correct race_horse_profile object", () => {
        compare_two_objects(race_horse_profile, race_horse_profile_testing_object);
    });
});


// testing the get_total_horse_count_upper function
describe("Check the get total horse count upper function", () => {
    var race_num = get_total_horse_count_upper();

    it("should be 15", () =>{
        expect(race_num).toBe(15);
    });
});


// testing the get_total_horse_count_lower function
describe("Check the get total horse count lower function", () => {
    var race_num = get_total_horse_count_lower();

    it("should be 2", () =>{
        expect(race_num).toBe(2);
    });
});