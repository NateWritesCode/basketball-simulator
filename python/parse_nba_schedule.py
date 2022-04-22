import csv
from datetime import datetime
import json

game_dates = []

with open("./source_data/NBA_2021_2022_sched.csv", 'rt') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    next(reader) #skip header row
    for row in reader:
        print(row[2])
        date_time_obj = datetime.strptime(row[2], '%d/%m/%Y %H:%M')
        print ("The type of the date is now",  type(date_time_obj))
        print ("The date is", date_time_obj)

        game_dates.append(date_time_obj.strftime("%Y-%m-%d"))
        
        # d = row[0]
        # year = int(d[6:])
        # month = int(d[3:5])
        # day = int(d[:2])
        # dateObj = date(year, month, day)
        # homeTeam = row[1]
        # awayTeam = row[2]
        # teams[homeTeam].schedule.append(Game(dateObj, teams[awayTeam], True))
        # teams[awayTeam].schedule.append(Game(dateObj, teams[homeTeam], False))

with open('../server/src/data/gameDates.json', 'w') as outfile:
    json.dump(game_dates, outfile)
