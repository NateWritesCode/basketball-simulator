library(tidyverse)
library(jsonlite)

data_dir <- file.path(Sys.getenv("HOME"), "Projects", "basketball-ultimate", "python", "output")
output_dir <- file.path(Sys.getenv("HOME"), "Projects", "basketball-ultimate", "server", "src", "data", "r")

pbp <- read_csv(file.path(data_dir, "pbp.csv"))
fg <- read_csv(file.path(data_dir, "fg.csv"))
foul <- read_csv(file.path(data_dir, "foul.csv"))
ft <- read_csv(file.path(data_dir, "ft.csv"))
jump_ball <- read_csv(file.path(data_dir, "jump_ball.csv"))
rebound <- read_csv(file.path(data_dir, "rebound.csv"))
substitution <- read_csv(file.path(data_dir, "substitution.csv"))
turnover <- read_csv(file.path(data_dir, "turnover.csv"))
violation <- read_csv(file.path(data_dir, "violation.csv"))

pbp_cols_keep <- c("defense_team_id", "offense_team_id", "pbp_id", "player1_id", "player2_id", "player3_id", "possession_length", "seconds_remaining", "score_margin")

fg_join <- inner_join(select(pbp, pbp_cols_keep), fg, "pbp_id")
foul_join <- inner_join(select(pbp, pbp_cols_keep), foul, "pbp_id")
ft_join <- inner_join(select(pbp, pbp_cols_keep), ft, "pbp_id")
jump_ball_join <- inner_join(select(pbp, pbp_cols_keep), jump_ball, "pbp_id")
rebound_join <- inner_join(select(pbp, pbp_cols_keep), rebound, "pbp_id")
substitution_join <- inner_join(select(pbp, pbp_cols_keep), substitution, "pbp_id")
turnover_join <- inner_join(select(pbp, pbp_cols_keep), turnover, "pbp_id")
violation_join <- inner_join(select(pbp, pbp_cols_keep), violation, "pbp_id")

fg_possession_length <- c()
foul_possession_length <- c()
general_possession_length <- c()
rebound_possession_length <- c()
turnover_possession_length <- c()
violation_possession_length <- c()

seconds_remaining = 720.0

for (i in 1:100000) {
  print(paste("Item: ", i, "of", nrow(pbp)))
  
  pbp_item = pbp[i,]
  
  if (pbp_item$is_start_of_period == TRUE || pbp_item$is_end_of_period == TRUE) {
    seconds_remaining = 720.0
  }
  
  if (pbp_item$seconds_remaining != seconds_remaining) {
    diff = seconds_remaining - pbp_item$seconds_remaining
    if (diff < 1 || diff > 35) {
      next
    }
    
    general_possession_length <- append(general_possession_length, diff)
    seconds_remaining = pbp_item$seconds_remaining
    if (pbp_item$is_field_goal == TRUE) {
      fg_possession_length <- append(fg_possession_length, diff)
    } else if (pbp_item$is_foul == TRUE) {
      foul_possession_length <- append(foul_possession_length, diff)
    } else if (pbp_item$is_rebound == TRUE) {
      rebound_possession_length <- append(rebound_possession_length, diff)
    } else if (pbp_item$is_turnover == TRUE) {
      turnover_possession_length <- append(turnover_possession_length, diff)
    } else if (pbp_item$is_violation == TRUE) {
      violation_possession_length <- append(violation_possession_length, diff)
    }
  }
}


fg_possession_length_summary <- as_tibble(as.data.frame(table(unlist(fg_possession_length)))) %>% 
  mutate(Var1=as.integer(Var1), Freq = Freq / length(fg_possession_length)) %>% 
  rename(possessionLength=Var1, prob=Freq)

file_entity <- file(file.path(output_dir, "fgLengthProbability.json"))
writeLines(toJSON(fg_possession_length_summary, digits=NA, pretty=TRUE), file_entity)
close(file_entity)

foul_possession_length_summary <- as_tibble(as.data.frame(table(unlist(foul_possession_length)))) %>% 
  mutate(Var1=as.integer(Var1), Freq = Freq / length(foul_possession_length)) %>% 
  rename(possessionLength=Var1, prob=Freq)

file_entity <- file(file.path(output_dir, "foulLengthProbability.json"))
writeLines(toJSON(foul_possession_length_summary, digits=NA, pretty=TRUE), file_entity)
close(file_entity)

general_possession_length_summary <- as_tibble(as.data.frame(table(unlist(general_possession_length)))) %>% 
  mutate(Var1=as.integer(Var1), Freq = Freq / length(general_possession_length)) %>% 
  rename(possessionLength=Var1, prob=Freq)

file_entity <- file(file.path(output_dir, "generalLengthProbability.json"))
writeLines(toJSON(general_possession_length_summary, digits=NA, pretty=TRUE), file_entity)
close(file_entity)

rebound_possession_length_summary <- as_tibble(as.data.frame(table(unlist(rebound_possession_length)))) %>% 
  mutate(Var1=as.integer(Var1), Freq = Freq / length(rebound_possession_length)) %>% 
  rename(possessionLength=Var1, prob=Freq)

file_entity <- file(file.path(output_dir, "reboundLengthProbability.json"))
writeLines(toJSON(rebound_possession_length_summary, digits=NA, pretty=TRUE), file_entity)
close(file_entity)

turnover_possession_length_summary <- as_tibble(as.data.frame(table(unlist(turnover_possession_length)))) %>% 
  mutate(Var1=as.integer(Var1), Freq = Freq / length(turnover_possession_length)) %>% 
  rename(possessionLength=Var1, prob=Freq)

file_entity <- file(file.path(output_dir, "turnoverLengthProbability.json"))
writeLines(toJSON(turnover_possession_length_summary, digits=NA, pretty=TRUE), file_entity)
close(file_entity)

violation_possession_length_summary <- as_tibble(as.data.frame(table(unlist(violation_possession_length)))) %>% 
  mutate(Var1=as.integer(Var1), Freq = Freq / length(violation_possession_length)) %>% 
  rename(possessionLength=Var1, prob=Freq)

file_entity <- file(file.path(output_dir, "violationLengthProbability.json"))
writeLines(toJSON(violation_possession_length_summary, digits=NA, pretty=TRUE), file_entity)
close(file_entity)






fg_group_by_cols <- c("is_and1", "is_assisted", "is_blocked", "is_made", "is_putback", "shot_type")

fg_join_num_rows = nrow(fg_join)

fg_summary <- fg_join %>%
  group_by(across(all_of(fg_group_by_cols))) %>%
  summarise(probability = n() / fg_join_num_rows, count=n()) 

pbp_summary <- pbp %>% 
  summarise(
    countsAsPossesion(is_count_as_possession == TRUE),
    ejections=sum(is_ejection == TRUE),
    fieldGoals=sum(is_field_goal == TRUE),
    fouls=sum(is_foul == TRUE),
    jumpBalls=sum(is_jump_ball == TRUE),
    rebounds=sum(is_rebound == TRUE),
    replays=sum(is_replay == TRUE),
    substitions=sum(is_substitution == TRUE),
    timeouts=sum(is_timeout == TRUE),
    turnover=sum(is_turnover == TRUE),
    violation=sum(is_violation == TRUE),
    total=n()
  )

file_entity <- file(file.path(output_dir, "fgProbability.json"))
writeLines(toJSON(fg_summary, digits=NA, pretty=TRUE), file_entity)
close(file_entity)



        