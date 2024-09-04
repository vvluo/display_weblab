import json
import jsonpickle
from json import JSONEncoder
import math

raw = dict()
raw2 = dict()
categories = dict()
numbers = dict()
names = dict()


def course_category(entry):
    coseen = set()
    res = dict()
    size = dict()
    for choice in (raw, raw2):
        for cl in choice:
            if cl in coseen:
                continue
            group = choice[cl][entry]
            helper_append(group, cl, res, size)
            coseen.add(cl)
        # if group not in res:
        #     res[group] = [cl,]
        #     size[group] = 1
        # else:
        #     res[group].append(cl)
        #     size[group] += 1
    # set_res = dict()
    # # print("RESULT", res)
    # for group in res:
    #     set_res[group] = jsonpickle.encode(set(res[group]))
    return (res, size)

def union_find(entries):
    coseen = set()
    res = dict()
    size = dict()
    res["true"] = []
    res["false"] = []
    size["true"] = 0
    size["false"] = 0
    try:
        for choice in (raw, raw2):
            for cl in choice:
                if cl in coseen:
                    continue
                seen = False
                for entry in entries:
                    group = choice[cl][entry]
                    if group:
                        if cl not in res["true"]:
                            res["true"].append(cl)
                        seen = True
                if seen:
                    if cl not in res["true"]:
                        size["true"] += 1
                else:
                    if cl not in res["false"]:
                        res["false"].append(cl)
                        size["false"] += 1
                coseen.add(cl)
    except:
        print("True False values required")
    # set_res = dict()
    # for group in res:
    #     set_res[group] = jsonpickle.encode(set(res[group]))
    return (res, size)

def mod_union_find(entries):
    coseen = set()
    res = dict()
    size = dict()
    # res["true"] = []
    # res["false"] = []
    # size["true"] = 0
    # size["false"] = 0
    for choice in (raw, raw2):
        for cl in choice:
            if cl in coseen:
                continue
            group = 0
            for entry in entries:
                group += int(choice[cl][entry])
            helper_append(group, cl, res, size)
            coseen.add(cl)
        # if group not in res:
        #     res[group] = [cl,]
        #     size[group] = 1
        # else:
        #     res[group].append(cl)
        #     size[group] += 1
    # set_res = dict()
    # for group in res:
    #     set_res[group] = jsonpickle.encode(set(res[group]))
    return (res, size)

# for s and t e.g.["FA", "JA", "SU"]
def peel_subset(entry):
    special = {
        "FA":"Fall",
        "JA":"IAP",
        "SP":"Spring",
        "SU":"Summer",
        "lecture":"Lecture",
        "lab":"Lab",
        "recitation":"Recitation",
        "design":"Design",
    }
    coseen = set()
    res = dict()
    size = dict()
    for choice in (raw, raw2):
        for cl in choice:
            if cl in coseen:
                continue
            group = choice[cl][entry]
            for element in group:
                ele = special[element]
                helper_append(ele, cl, res, size)
            coseen.add(cl)
                # if ele not in res:
                #     res[ele] = [cl,]
                #     size[ele] = 1
                # else:
                #     res[ele].append(cl)
                #     size[ele] += 1
    # set_res = dict()
    # # print("RESULT", res)
    # for ele in res:
    #     set_res[ele] = jsonpickle.encode(set(res[ele]))
    return (res, size)

def time_place_stats(entry):
    #entry might be something like "labSections"
    coseen = set()
    num_sections = dict()
    buildings = dict()
    rooms_to_class = dict()
    day_to_class = dict()
    raw_time_to_class = dict()
    length_to_class = dict()

    MAGIC_DAY = 30
    MAGIC_MAP = {
        0 : "Monday",
        1 : "Tuesday",
        2 : "Wednesday",
        3 : "Thursday",
        4 : "Friday",
    }
    def format_date_time(time_float):
        ret = ""
        pm = False
        if time_float >=13:
           pm = True
        if pm:
            ret += str(int(math.floor(time_float))-12)
        else:
            ret += str(int(math.floor(time_float)))
        if time_float >=12:
            pm = True
        if time_float != math.floor(time_float):
            ret += ":30 "
        else:
            ret += ":00 "
        if pm:
            ret += "PM"
        else:
            ret += "AM"
        return ret


    for choice in (raw, raw2):
        for cl in choice:
            if cl in coseen:
                continue
            if not entry in choice[cl]:
                continue
            group = choice[cl][entry]
            #[[[[3,3],[63,3]],"9-217"]]
            size = len(group)
            helper_append(size, cl, num_sections)
            for arrangement in group:
                assert len(arrangement) == 2
                room_str = arrangement[-1]
                ix = room_str.find("-")
                if ix != -1:
                    helper_append(room_str[:ix], cl, buildings)
                helper_append(room_str, cl, rooms_to_class)
                for day_bit in arrangement[0]:
                    helper_append(MAGIC_MAP[day_bit[0] // MAGIC_DAY], cl, day_to_class)
                    helper_append(format_date_time(round((8+(day_bit[0] % MAGIC_DAY)*0.5)*10)/10), cl, raw_time_to_class)
                    helper_append(str(round((day_bit[1]*0.5)*10)/10)+" hours", cl, length_to_class)
            coseen.add(cl)
        
    return (num_sections, buildings, rooms_to_class, day_to_class, raw_time_to_class, length_to_class,)

def helper_append(item, cl, dictionary, dictionary2=dict()):
    # if cl in dictionary.get(item, []):
    #     return
    if item not in dictionary:
        dictionary[item] = [cl,]
        dictionary2[item] = 1
    elif cl not in dictionary[item]:
            dictionary[item].append(cl)
            dictionary2[item] += 1
# def mutator(categories, numbers, entry):
#     # special case galore
#     if entry == "co":
# possibly 4-0-8 , 5-0-7 course


def run():
    for choice in (raw, raw2):
        for cl in choice:
            names[cl] = choice[cl]["n"]

    # singles (mostly booleans)
    for entry in ("co", "tb", "hh", "ha", "hs", "he", "ci", "cw", 
                "re", "la", "pl", "u1", "u2", "u3", "le", "vu",
                "v", "nx", "rp", "hf", "f", "lm",):
        # s class type, t terms are subsetter, but O(1) sense done below
         
        # https://github.com/sipb/hydrant/blob/main/scrapers/fireroad.py
        categories[entry], numbers[entry] = course_category(entry)
        print("done with" + entry)
    
    for entry in ("s", "t"):
        categories[entry], numbers[entry] = peel_subset(entry)
        print("done with" + entry)

    categories["hass"], numbers["hass"] = union_find(["hh", "ha", "hs", "he"])
    categories["comm"], numbers["comm"] = union_find(["ci","cw"])
    # print(len(categories["hass"]["false"]), " ", numbers["hass"])

    categories["totalunits"], numbers["totalunits"] = mod_union_find(["u1", "u2", "u3"])

    categories["lenums"], categories["lebuildings"], categories["lerooms"], categories["ledays"], categories["lestarts"], categories["ledurations"], = time_place_stats("lectureSections")
    categories["rcnums"], categories["rcbuildings"], categories["rcrooms"], categories["rcdays"], categories["rcstarts"], categories["rcdurations"], = time_place_stats("recitationSections")
    categories["lbnums"], categories["lbbuildings"], categories["lbrooms"], categories["lbdays"], categories["lbstarts"], categories["lbdurations"], = time_place_stats("labSections")
    categories["denums"], categories["debuildings"], categories["derooms"], categories["dedays"], categories["destarts"], categories["dedurations"], = time_place_stats("designSections")


    def categories_to_numbers(entry):
        nums = dict()
        for bud in categories[entry]:
            # print(len(categories[entry][bud]))
            nums[bud] = len(categories[entry][bud])
        numbers[entry] = nums

    # categories_to_numbers("lenums")

    iterable = ("lenums", "lebuildings", "lerooms", "ledays", "lestarts", "ledurations",
    "rcnums", "rcbuildings", "rcrooms", "rcdays", "rcstarts", "rcdurations",
    "lbnums", "lbbuildings", "lbrooms", "lbdays", "lbstarts", "lbdurations",
    "denums", "debuildings", "derooms", "dedays", "destarts", "dedurations",)

    for item in iterable:
        categories_to_numbers(item)


    # need solution for : all "section" types, instructor, pre-reqs
    # proposed condition unions: (hh, ha, hs, he), (ci, cw), done (u1, u2, u3)
        
    #special case: "n" name
    #banned : "sa" joint courses, "mw" meets with, "cl" class number (until it gets reformatted into like repeat class number)
    #yellow : "*rooms" maybe parse for buildings is better done
    #internal discrete grouping required: "ra" rating, "h" hours, "si" enrollment number ??
    

    
    

if __name__ == "__main__":
    with open("latest.json") as f:
        latest = json.load(f)
    raw = latest["classes"]
    with open("f23.json") as f:
        second_latest = json.load(f)
    raw2 = second_latest["classes"]
    run()
    with open("categories.json", "w") as f:
        json.dump(categories, f)
    
    with open("numbers.json", "w") as f:
        json.dump(numbers, f)

    with open("names.json", "w") as f:
        json.dump(names, f)