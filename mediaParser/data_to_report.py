"""
this program reads json files and create a report
Usage: python3 data_to_report.py <yyyy-mm-dd>
"""

import json
from pprint import pprint
import sys

global output_json
output_json = []
date = sys.argv[1]

def read_json( media_name ) : 
	#date = sys.argv[1]
	file_name = media_name + '_' + date + '.json'
	file = json.load(open(file_name))
	news_count = len(file)
	word_count = 0
	category = {}

	for news in file :
		word_count += len(news["content"])
		if news["category"] in category :
			category[news["category"]] += 1
		else : 	
			category[news["category"]] = 1

	data = {
			'website' : media_name,
			'news_count' : news_count ,
			'word_count' : word_count ,
			'average_word' : round( word_count / news_count )
		}

	data["category"] = category
	global output_json
	output_json.append(data)


read_json("cts")
read_json("cna")
read_json("udn")
read_json("setn")

output_file_name = 'report_' + date + '.json'
with open(output_file_name, 'w') as outfile:
    json.dump(output_json, outfile)

pprint (output_json)
