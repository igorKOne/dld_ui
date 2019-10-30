import json
import sys
import re

file_name = 'TableMemoryOverview.json'
new_file_name = 'new_' + file_name
folder: str = '../'

# 1 clean with regular expressions
# re1 = """"__metadata":\s*\{\n.*\n.*\n\s*\},"""

def main():


    source_fields = ['CURRENT_YEAR_VOL','CURRENT_MIN_1_YEAR_VOL','CURRENT_MIN_2_YEAR_VOL','OLD_YEAR_VOL']
    target_fields = ['CURRENT_YEAR_VOL_GB','CURRENT_MIN_1_YEAR_VOL_GB','CURRENT_MIN_2_YEAR_VOL_GB','OLD_YEAR_VOL_GB']

    # Add the following 
    def convert(obj):
        for s,t in zip(source_fields, target_fields):
            obj[t] = str(int(obj[s]) / 1073741824)
        return obj

    with open(folder+file_name,'r') as f:
        l = json.load(f)
        nl = list(map(convert,l))
    
    with open(folder+new_file_name,'x') as f:
        json.dump(nl,f)


if __name__ == "__main__":
    
    #file_name = sys.argv[1]
    folder = sys.argv[1] or '../'

    main()