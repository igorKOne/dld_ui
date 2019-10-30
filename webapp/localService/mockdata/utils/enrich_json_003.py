import json
import sys

file_name = 'MEM_OVERVIEW.json'
new_file_name = 'new_' + file_name
folder = '../'
# 1 clean with regular expressions
# re1 = """"__metadata":\s*\{\n.*\n.*\n\s*\},\n?\s*"""

def main():

    # Process each object in the list 
    def convert(obj):
        #print(obj)
        # calculate "MAX_STORAGE"
        obj["MAX_STORAGE"] = str(round(float(obj["ALLOCATION_LIMIT"]) / 2,0))

        # format MONTH_STRING
        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        per = obj["SNAPSHOT_PERIOD"] # must be like 201812
        obj["MONTH_STRING"] = "{}'{}".format(months[int(per[4:6])-1],per[2:4])
        return obj

    # read from "results" attribute
    with open(folder + file_name,'r') as f:
        l = json.load(f)
        nl = list(map(convert,l))
        nl.sort(key=lambda o: o["SNAPSHOT_PERIOD"]) # sort the result by "SNAPSHOT_PERIOD"
    
    # save to "results" attribute    
    with open(folder + new_file_name,'x') as f:
        json.dump(nl,f)


if __name__ == "__main__":
    
    folder = sys.argv[1] or '../'

    main()