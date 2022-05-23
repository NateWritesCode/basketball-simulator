import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from './general';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
};

export type Conference = {
  __typename?: 'Conference';
  abbrev: Scalars['String'];
  divisions?: Maybe<Array<Division>>;
  id: Scalars['Int'];
  league: League;
  name: Scalars['String'];
};

export type Division = {
  __typename?: 'Division';
  abbrev: Scalars['String'];
  conference?: Maybe<Conference>;
  id: Scalars['Int'];
  league: League;
  name: Scalars['String'];
};

export type League = {
  __typename?: 'League';
  abbrev: Scalars['String'];
  conferences?: Maybe<Array<Conference>>;
  divisions?: Maybe<Array<Division>>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type LeagueStandings = {
  __typename?: 'LeagueStandings';
  league: League;
  teams: Array<StandingsTeam>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createFoo?: Maybe<Scalars['Boolean']>;
  sandbox?: Maybe<Scalars['Boolean']>;
  simulate?: Maybe<Scalars['Boolean']>;
  simulateCleanup?: Maybe<Scalars['Boolean']>;
  simulatePrep?: Maybe<Scalars['Boolean']>;
};

export type Player = {
  __typename?: 'Player';
  active: Scalars['Boolean'];
  birthdate: Scalars['DateTime'];
  country: Scalars['String'];
  draftNumber: Scalars['Int'];
  draftRound: Scalars['Int'];
  draftYear: Scalars['DateTime'];
  familyName: Scalars['String'];
  fromYear: Scalars['DateTime'];
  givenName: Scalars['String'];
  greatest75: Scalars['Boolean'];
  hasPlayedDLeague: Scalars['Boolean'];
  hasPlayedGames: Scalars['Boolean'];
  hasPlayedNba: Scalars['Boolean'];
  height: Scalars['Int'];
  id: Scalars['Int'];
  jerseyNumber: Scalars['Int'];
  playerCode: Scalars['String'];
  position: Scalars['String'];
  school: Scalars['String'];
  seasonsExperience: Scalars['Int'];
  slug: Scalars['String'];
  teamId: Scalars['Int'];
  toYear: Scalars['DateTime'];
  weight: Scalars['Int'];
};

export type PlayerStats = {
  __typename?: 'PlayerStats';
  andOne: Scalars['Int'];
  ast: Scalars['Int'];
  blk: Scalars['Int'];
  blkd: Scalars['Int'];
  drb: Scalars['Int'];
  dunks: Scalars['Int'];
  fga: Scalars['Int'];
  fgm: Scalars['Int'];
  flagrant1: Scalars['Int'];
  flagrant2: Scalars['Int'];
  fouled: Scalars['Int'];
  fouls: Scalars['Int'];
  foulsOffensive: Scalars['Int'];
  foulsOffensiveCharge: Scalars['Int'];
  foulsOffensiveOther: Scalars['Int'];
  foulsShooting: Scalars['Int'];
  foulsTechnical: Scalars['Int'];
  fta: Scalars['Int'];
  ftm: Scalars['Int'];
  heaves: Scalars['Int'];
  jumpBallsLost: Scalars['Int'];
  jumpBallsWon: Scalars['Int'];
  orb: Scalars['Int'];
  plusMinus: Scalars['Int'];
  pts: Scalars['Int'];
  ptsba: Scalars['Int'];
  stl: Scalars['Int'];
  substitutionIn: Scalars['Int'];
  substitutionOut: Scalars['Int'];
  timePlayed: Scalars['Int'];
  tov: Scalars['Int'];
  tpa: Scalars['Int'];
  tpm: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getLeagueStandings?: Maybe<LeagueStandings>;
  getOnePlayer?: Maybe<Player>;
  getServerTime?: Maybe<Scalars['String']>;
  getTeamInfo?: Maybe<TeamInfo>;
};


export type QueryGetLeagueStandingsArgs = {
  gameGroupId: Scalars['Int'];
  leagueId: Scalars['Int'];
};


export type QueryGetOnePlayerArgs = {
  id: Scalars['Int'];
};


export type QueryGetTeamInfoArgs = {
  abbrev: Scalars['String'];
};

export type StandingsTeam = {
  __typename?: 'StandingsTeam';
  abbrev: Scalars['String'];
  conferenceId?: Maybe<Scalars['Int']>;
  divisionId?: Maybe<Scalars['Int']>;
  homeName: Scalars['String'];
  id: Scalars['Int'];
  l: Scalars['Int'];
  leagueId: Scalars['Int'];
  nickname: Scalars['String'];
  w: Scalars['Int'];
};

export type Team = {
  __typename?: 'Team';
  abbrev: Scalars['String'];
  conferenceId?: Maybe<Scalars['Int']>;
  divisionId?: Maybe<Scalars['Int']>;
  facebook?: Maybe<Scalars['String']>;
  homeName: Scalars['String'];
  id: Scalars['Int'];
  instagram?: Maybe<Scalars['String']>;
  lat: Scalars['Float'];
  leagueId?: Maybe<Scalars['Int']>;
  lng: Scalars['Float'];
  nickname: Scalars['String'];
  twitter?: Maybe<Scalars['String']>;
  venue: Scalars['String'];
  venueCapacity: Scalars['Int'];
  yearFounded: Scalars['DateTime'];
};

export type TeamInfo = {
  __typename?: 'TeamInfo';
  teamGameGroups?: Maybe<Array<TeamStats>>;
  teamGames?: Maybe<Array<TeamStats>>;
  teamInfo: Team;
};

export type TeamStats = {
  __typename?: 'TeamStats';
  andOne: Scalars['Int'];
  ast: Scalars['Int'];
  blk: Scalars['Int'];
  blkd: Scalars['Int'];
  drb: Scalars['Int'];
  dunks: Scalars['Int'];
  ejections: Scalars['Int'];
  fga: Scalars['Int'];
  fgm: Scalars['Int'];
  fouls: Scalars['Int'];
  foulsOffensive: Scalars['Int'];
  foulsOffensiveCharge: Scalars['Int'];
  foulsOffensiveOther: Scalars['Int'];
  foulsShooting: Scalars['Int'];
  foulsTechnical: Scalars['Int'];
  fta: Scalars['Int'];
  ftm: Scalars['Int'];
  heaves: Scalars['Int'];
  jumpBallsLost: Scalars['Int'];
  jumpBallsWon: Scalars['Int'];
  orb: Scalars['Int'];
  pf: Scalars['Int'];
  pts: Scalars['Int'];
  stl: Scalars['Int'];
  substitutions: Scalars['Int'];
  teamDrb: Scalars['Int'];
  teamOrb: Scalars['Int'];
  tov: Scalars['Int'];
  tpa: Scalars['Int'];
  tpm: Scalars['Int'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Conference: ResolverTypeWrapper<Conference>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Division: ResolverTypeWrapper<Division>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  League: ResolverTypeWrapper<League>;
  LeagueStandings: ResolverTypeWrapper<LeagueStandings>;
  Mutation: ResolverTypeWrapper<{}>;
  Player: ResolverTypeWrapper<Player>;
  PlayerStats: ResolverTypeWrapper<PlayerStats>;
  Query: ResolverTypeWrapper<{}>;
  StandingsTeam: ResolverTypeWrapper<StandingsTeam>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Team: ResolverTypeWrapper<Team>;
  TeamInfo: ResolverTypeWrapper<TeamInfo>;
  TeamStats: ResolverTypeWrapper<TeamStats>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  Conference: Conference;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  Division: Division;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  League: League;
  LeagueStandings: LeagueStandings;
  Mutation: {};
  Player: Player;
  PlayerStats: PlayerStats;
  Query: {};
  StandingsTeam: StandingsTeam;
  String: Scalars['String'];
  Team: Team;
  TeamInfo: TeamInfo;
  TeamStats: TeamStats;
}>;

export type ConferenceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Conference'] = ResolversParentTypes['Conference']> = ResolversObject<{
  abbrev?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  divisions?: Resolver<Maybe<Array<ResolversTypes['Division']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  league?: Resolver<ResolversTypes['League'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DivisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Division'] = ResolversParentTypes['Division']> = ResolversObject<{
  abbrev?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conference?: Resolver<Maybe<ResolversTypes['Conference']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  league?: Resolver<ResolversTypes['League'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LeagueResolvers<ContextType = Context, ParentType extends ResolversParentTypes['League'] = ResolversParentTypes['League']> = ResolversObject<{
  abbrev?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conferences?: Resolver<Maybe<Array<ResolversTypes['Conference']>>, ParentType, ContextType>;
  divisions?: Resolver<Maybe<Array<ResolversTypes['Division']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LeagueStandingsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LeagueStandings'] = ResolversParentTypes['LeagueStandings']> = ResolversObject<{
  league?: Resolver<ResolversTypes['League'], ParentType, ContextType>;
  teams?: Resolver<Array<ResolversTypes['StandingsTeam']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createFoo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sandbox?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  simulate?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  simulateCleanup?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  simulatePrep?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
}>;

export type PlayerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = ResolversObject<{
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  birthdate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  draftNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  draftRound?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  draftYear?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  familyName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromYear?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  givenName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  greatest75?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPlayedDLeague?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPlayedGames?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPlayedNba?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  jerseyNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  playerCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  school?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  seasonsExperience?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teamId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  toYear?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayerStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PlayerStats'] = ResolversParentTypes['PlayerStats']> = ResolversObject<{
  andOne?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ast?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  blk?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  blkd?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  drb?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dunks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fga?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fgm?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  flagrant1?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  flagrant2?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fouled?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fouls?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsOffensive?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsOffensiveCharge?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsOffensiveOther?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsShooting?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsTechnical?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fta?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ftm?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  heaves?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  jumpBallsLost?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  jumpBallsWon?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orb?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  plusMinus?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ptsba?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stl?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  substitutionIn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  substitutionOut?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timePlayed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tov?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tpa?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tpm?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getLeagueStandings?: Resolver<Maybe<ResolversTypes['LeagueStandings']>, ParentType, ContextType, RequireFields<QueryGetLeagueStandingsArgs, 'gameGroupId' | 'leagueId'>>;
  getOnePlayer?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType, RequireFields<QueryGetOnePlayerArgs, 'id'>>;
  getServerTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getTeamInfo?: Resolver<Maybe<ResolversTypes['TeamInfo']>, ParentType, ContextType, RequireFields<QueryGetTeamInfoArgs, 'abbrev'>>;
}>;

export type StandingsTeamResolvers<ContextType = Context, ParentType extends ResolversParentTypes['StandingsTeam'] = ResolversParentTypes['StandingsTeam']> = ResolversObject<{
  abbrev?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conferenceId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  divisionId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  homeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  l?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  leagueId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nickname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  w?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeamResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = ResolversObject<{
  abbrev?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conferenceId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  divisionId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  facebook?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  homeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instagram?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  leagueId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  lng?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  nickname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  twitter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  venue?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  venueCapacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  yearFounded?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeamInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TeamInfo'] = ResolversParentTypes['TeamInfo']> = ResolversObject<{
  teamGameGroups?: Resolver<Maybe<Array<ResolversTypes['TeamStats']>>, ParentType, ContextType>;
  teamGames?: Resolver<Maybe<Array<ResolversTypes['TeamStats']>>, ParentType, ContextType>;
  teamInfo?: Resolver<ResolversTypes['Team'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeamStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TeamStats'] = ResolversParentTypes['TeamStats']> = ResolversObject<{
  andOne?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ast?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  blk?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  blkd?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  drb?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dunks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ejections?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fga?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fgm?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fouls?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsOffensive?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsOffensiveCharge?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsOffensiveOther?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsShooting?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  foulsTechnical?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fta?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ftm?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  heaves?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  jumpBallsLost?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  jumpBallsWon?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orb?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pf?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stl?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  substitutions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  teamDrb?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  teamOrb?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tov?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tpa?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tpm?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Conference?: ConferenceResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Division?: DivisionResolvers<ContextType>;
  League?: LeagueResolvers<ContextType>;
  LeagueStandings?: LeagueStandingsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  PlayerStats?: PlayerStatsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  StandingsTeam?: StandingsTeamResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  TeamInfo?: TeamInfoResolvers<ContextType>;
  TeamStats?: TeamStatsResolvers<ContextType>;
}>;

