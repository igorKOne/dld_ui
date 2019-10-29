import json
import sys

file_name = 'MEM_OVERVIEW.json'
new_file_name = 'new_' + file_name
folder = '../'

def main():

    # Process each object in the list 
    def convert(obj):
        #print(obj)
        # calculate "MAX_STORAGE"
        obj["MAX_STORAGE"] = str(float(obj["ALLOCATION_LIMIT"]) / 2)
        return obj

    # read from "results" attribute
    with open(folder + file_name,'r') as f:
        l = json.load(f)
        nl = list(map(convert,l))
    
    # save to "results" attribute    
    with open(folder + new_file_name,'x') as f:
        json.dump(nl,f)


if __name__ == "__main__":
    
    #file_name = sys.argv[1]

    main()