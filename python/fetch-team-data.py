from nba_api.stats.static import teams
from nba_api.stats.endpoints import teamdetails
import pandas as pd
import time
import json

all_teams = teams.get_teams()

counter = 1
num_of_teams = len(all_teams)

# self.team_awards_championships = Endpoint.DataSet(data=data_sets['TeamAwardsChampionships'])
# self.team_awards_conf = Endpoint.DataSet(data=data_sets['TeamAwardsConf'])
# self.team_awards_div = Endpoint.DataSet(data=data_sets['TeamAwardsDiv'])
# self.team_background = Endpoint.DataSet(data=data_sets['TeamBackground'])
# self.team_history = Endpoint.DataSet(data=data_sets['TeamHistory'])
# self.team_hof = Endpoint.DataSet(data=data_sets['TeamHof'])
# self.team_retired = Endpoint.DataSet(data=data_sets['TeamRetired'])
# self.team_social_sites = Endpoint.DataSet(data=data_sets['TeamSocialSites'])

teams = []


for team in all_teams:
    teams_df = pd.DataFrame()
    print("Processing team", counter, "of", num_of_teams)
    time.sleep(3)
    team_details = teamdetails.TeamDetails(team_id=team["id"])
    teams.append(json.loads(team_details.get_normalized_json()))

    # print(type(team_history.get_normalized_json()))
    # print(team_history.get_normalized_json())
    # print(team_history.team_hof.get_data_frame())
    counter += 1


with open('../server/src/data/nba-api/teamdetails.json', 'w') as outfile:
    json.dump(teams, outfile)
