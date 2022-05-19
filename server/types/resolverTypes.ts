import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  /** Banking account number is a string of 5 to 17 alphanumeric values for representing an generic account number */
  AccountNumber: any;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: any;
  /** The `Byte` scalar type represents byte value as a Buffer */
  Byte: any;
  /** A country code as defined by ISO 3166-1 alpha-2 */
  CountryCode: any;
  /** A field whose value is a Currency: https://en.wikipedia.org/wiki/ISO_4217. */
  Currency: any;
  /** A field whose value conforms to the standard DID format as specified in did-core: https://www.w3.org/TR/did-core/. */
  DID: any;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /**
   *
   *     A string representing a duration conforming to the ISO8601 standard,
   *     such as: P1W1DT13H23M34S
   *     P is the duration designator (for period) placed at the start of the duration representation.
   *     Y is the year designator that follows the value for the number of years.
   *     M is the month designator that follows the value for the number of months.
   *     W is the week designator that follows the value for the number of weeks.
   *     D is the day designator that follows the value for the number of days.
   *     T is the time designator that precedes the time components of the representation.
   *     H is the hour designator that follows the value for the number of hours.
   *     M is the minute designator that follows the value for the number of minutes.
   *     S is the second designator that follows the value for the number of seconds.
   *
   *     Note the time designator, T, that precedes the time value.
   *
   *     Matches moment.js, Luxon and DateFns implementations
   *     ,/. is valid for decimal places and +/- is a valid prefix
   *
   */
  Duration: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  GUID: any;
  /** A field whose value is a CSS HSL color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSL: any;
  /** A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSLA: any;
  /** A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors. */
  HexColorCode: any;
  /** A field whose value is a hexadecimal: https://en.wikipedia.org/wiki/Hexadecimal. */
  Hexadecimal: any;
  /** A field whose value is an International Bank Account Number (IBAN): https://en.wikipedia.org/wiki/International_Bank_Account_Number. */
  IBAN: any;
  /** A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4. */
  IPv4: any;
  /** A field whose value is a IPv6 address: https://en.wikipedia.org/wiki/IPv6. */
  IPv6: any;
  /** A field whose value is a ISBN-10 or ISBN-13 number: https://en.wikipedia.org/wiki/International_Standard_Book_Number. */
  ISBN: any;
  /**
   *
   *     A string representing a duration conforming to the ISO8601 standard,
   *     such as: P1W1DT13H23M34S
   *     P is the duration designator (for period) placed at the start of the duration representation.
   *     Y is the year designator that follows the value for the number of years.
   *     M is the month designator that follows the value for the number of months.
   *     W is the week designator that follows the value for the number of weeks.
   *     D is the day designator that follows the value for the number of days.
   *     T is the time designator that precedes the time components of the representation.
   *     H is the hour designator that follows the value for the number of hours.
   *     M is the minute designator that follows the value for the number of minutes.
   *     S is the second designator that follows the value for the number of seconds.
   *
   *     Note the time designator, T, that precedes the time value.
   *
   *     Matches moment.js, Luxon and DateFns implementations
   *     ,/. is valid for decimal places and +/- is a valid prefix
   *
   */
  ISO8601Duration: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: any;
  /** A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude */
  Latitude: any;
  /** A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`. */
  LocalDate: any;
  /** A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`.  This scalar is very similar to the `LocalTime`, with the only difference being that `LocalEndTime` also allows `24:00` as a valid value to indicate midnight of the following day.  This is useful when using the scalar to represent the exclusive upper bound of a time block. */
  LocalEndTime: any;
  /** A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`. */
  LocalTime: any;
  /** The locale in the format of a BCP 47 (RFC 5646) standard string */
  Locale: any;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: any;
  /** A field whose value is a valid decimal degrees longitude number (53.471): https://en.wikipedia.org/wiki/Longitude */
  Longitude: any;
  /** A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address. */
  MAC: any;
  /** Floats that will have a value less than 0. */
  NegativeFloat: any;
  /** Integers that will have a value less than 0. */
  NegativeInt: any;
  /** A string that cannot be passed as an empty value */
  NonEmptyString: any;
  /** Floats that will have a value of 0 or more. */
  NonNegativeFloat: any;
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: any;
  /** Floats that will have a value of 0 or less. */
  NonPositiveFloat: any;
  /** Integers that will have a value of 0 or less. */
  NonPositiveInt: any;
  /** A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c */
  ObjectID: any;
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  PhoneNumber: any;
  /** A field whose value is a valid TCP port within the range of 0 to 65535: https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_ports */
  Port: any;
  /** Floats that will have a value greater than 0. */
  PositiveFloat: any;
  /** Integers that will have a value greater than 0. */
  PositiveInt: any;
  /** A field whose value conforms to the standard postal code formats for United States, United Kingdom, Germany, Canada, France, Italy, Australia, Netherlands, Spain, Denmark, Sweden, Belgium, India, Austria, Portugal, Switzerland or Luxembourg. */
  PostalCode: any;
  /** A field whose value is a CSS RGB color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGB: any;
  /** A field whose value is a CSS RGBA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGBA: any;
  /** In the US, an ABA routing transit number (`ABA RTN`) is a nine-digit code to identify the financial institution. */
  RoutingNumber: any;
  /** The `SafeInt` scalar type represents non-fractional signed whole numeric values that are considered safe as defined by the ECMAScript specification. */
  SafeInt: any;
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: any;
  /** A field whose value exists in the standard IANA Time Zone Database: https://www.iana.org/time-zones */
  TimeZone: any;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: any;
  /** A currency string, such as $21.25 */
  USCurrency: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: any;
  /** Floats that will have a value of 0 or more. */
  UnsignedFloat: any;
  /** Integers that will have a value of 0 or more. */
  UnsignedInt: any;
  /** A field whose value is a UTC Offset: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones */
  UtcOffset: any;
  /** Represents NULL values */
  Void: any;
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
  familyName: Scalars['String'];
  givenName: Scalars['String'];
  id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getLeagueStandings?: Maybe<LeagueStandings>;
  getOnePlayer?: Maybe<Player>;
  getServerTime?: Maybe<Scalars['String']>;
};


export type QueryGetLeagueStandingsArgs = {
  gameGroupId: Scalars['Int'];
  leagueId: Scalars['Int'];
};


export type QueryGetOnePlayerArgs = {
  id: Scalars['Int'];
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
  AccountNumber: ResolverTypeWrapper<Partial<Scalars['AccountNumber']>>;
  BigInt: ResolverTypeWrapper<Partial<Scalars['BigInt']>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
  Byte: ResolverTypeWrapper<Partial<Scalars['Byte']>>;
  Conference: ResolverTypeWrapper<Partial<Conference>>;
  CountryCode: ResolverTypeWrapper<Partial<Scalars['CountryCode']>>;
  Currency: ResolverTypeWrapper<Partial<Scalars['Currency']>>;
  DID: ResolverTypeWrapper<Partial<Scalars['DID']>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']>>;
  DateTime: ResolverTypeWrapper<Partial<Scalars['DateTime']>>;
  Division: ResolverTypeWrapper<Partial<Division>>;
  Duration: ResolverTypeWrapper<Partial<Scalars['Duration']>>;
  EmailAddress: ResolverTypeWrapper<Partial<Scalars['EmailAddress']>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']>>;
  GUID: ResolverTypeWrapper<Partial<Scalars['GUID']>>;
  HSL: ResolverTypeWrapper<Partial<Scalars['HSL']>>;
  HSLA: ResolverTypeWrapper<Partial<Scalars['HSLA']>>;
  HexColorCode: ResolverTypeWrapper<Partial<Scalars['HexColorCode']>>;
  Hexadecimal: ResolverTypeWrapper<Partial<Scalars['Hexadecimal']>>;
  IBAN: ResolverTypeWrapper<Partial<Scalars['IBAN']>>;
  IPv4: ResolverTypeWrapper<Partial<Scalars['IPv4']>>;
  IPv6: ResolverTypeWrapper<Partial<Scalars['IPv6']>>;
  ISBN: ResolverTypeWrapper<Partial<Scalars['ISBN']>>;
  ISO8601Duration: ResolverTypeWrapper<Partial<Scalars['ISO8601Duration']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']>>;
  JSONObject: ResolverTypeWrapper<Partial<Scalars['JSONObject']>>;
  JWT: ResolverTypeWrapper<Partial<Scalars['JWT']>>;
  Latitude: ResolverTypeWrapper<Partial<Scalars['Latitude']>>;
  League: ResolverTypeWrapper<Partial<League>>;
  LeagueStandings: ResolverTypeWrapper<Partial<LeagueStandings>>;
  LocalDate: ResolverTypeWrapper<Partial<Scalars['LocalDate']>>;
  LocalEndTime: ResolverTypeWrapper<Partial<Scalars['LocalEndTime']>>;
  LocalTime: ResolverTypeWrapper<Partial<Scalars['LocalTime']>>;
  Locale: ResolverTypeWrapper<Partial<Scalars['Locale']>>;
  Long: ResolverTypeWrapper<Partial<Scalars['Long']>>;
  Longitude: ResolverTypeWrapper<Partial<Scalars['Longitude']>>;
  MAC: ResolverTypeWrapper<Partial<Scalars['MAC']>>;
  Mutation: ResolverTypeWrapper<{}>;
  NegativeFloat: ResolverTypeWrapper<Partial<Scalars['NegativeFloat']>>;
  NegativeInt: ResolverTypeWrapper<Partial<Scalars['NegativeInt']>>;
  NonEmptyString: ResolverTypeWrapper<Partial<Scalars['NonEmptyString']>>;
  NonNegativeFloat: ResolverTypeWrapper<Partial<Scalars['NonNegativeFloat']>>;
  NonNegativeInt: ResolverTypeWrapper<Partial<Scalars['NonNegativeInt']>>;
  NonPositiveFloat: ResolverTypeWrapper<Partial<Scalars['NonPositiveFloat']>>;
  NonPositiveInt: ResolverTypeWrapper<Partial<Scalars['NonPositiveInt']>>;
  ObjectID: ResolverTypeWrapper<Partial<Scalars['ObjectID']>>;
  PhoneNumber: ResolverTypeWrapper<Partial<Scalars['PhoneNumber']>>;
  Player: ResolverTypeWrapper<Partial<Player>>;
  Port: ResolverTypeWrapper<Partial<Scalars['Port']>>;
  PositiveFloat: ResolverTypeWrapper<Partial<Scalars['PositiveFloat']>>;
  PositiveInt: ResolverTypeWrapper<Partial<Scalars['PositiveInt']>>;
  PostalCode: ResolverTypeWrapper<Partial<Scalars['PostalCode']>>;
  Query: ResolverTypeWrapper<{}>;
  RGB: ResolverTypeWrapper<Partial<Scalars['RGB']>>;
  RGBA: ResolverTypeWrapper<Partial<Scalars['RGBA']>>;
  RoutingNumber: ResolverTypeWrapper<Partial<Scalars['RoutingNumber']>>;
  SafeInt: ResolverTypeWrapper<Partial<Scalars['SafeInt']>>;
  StandingsTeam: ResolverTypeWrapper<Partial<StandingsTeam>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  Team: ResolverTypeWrapper<Partial<Team>>;
  Time: ResolverTypeWrapper<Partial<Scalars['Time']>>;
  TimeZone: ResolverTypeWrapper<Partial<Scalars['TimeZone']>>;
  Timestamp: ResolverTypeWrapper<Partial<Scalars['Timestamp']>>;
  URL: ResolverTypeWrapper<Partial<Scalars['URL']>>;
  USCurrency: ResolverTypeWrapper<Partial<Scalars['USCurrency']>>;
  UUID: ResolverTypeWrapper<Partial<Scalars['UUID']>>;
  UnsignedFloat: ResolverTypeWrapper<Partial<Scalars['UnsignedFloat']>>;
  UnsignedInt: ResolverTypeWrapper<Partial<Scalars['UnsignedInt']>>;
  UtcOffset: ResolverTypeWrapper<Partial<Scalars['UtcOffset']>>;
  Void: ResolverTypeWrapper<Partial<Scalars['Void']>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountNumber: Partial<Scalars['AccountNumber']>;
  BigInt: Partial<Scalars['BigInt']>;
  Boolean: Partial<Scalars['Boolean']>;
  Byte: Partial<Scalars['Byte']>;
  Conference: Partial<Conference>;
  CountryCode: Partial<Scalars['CountryCode']>;
  Currency: Partial<Scalars['Currency']>;
  DID: Partial<Scalars['DID']>;
  Date: Partial<Scalars['Date']>;
  DateTime: Partial<Scalars['DateTime']>;
  Division: Partial<Division>;
  Duration: Partial<Scalars['Duration']>;
  EmailAddress: Partial<Scalars['EmailAddress']>;
  Float: Partial<Scalars['Float']>;
  GUID: Partial<Scalars['GUID']>;
  HSL: Partial<Scalars['HSL']>;
  HSLA: Partial<Scalars['HSLA']>;
  HexColorCode: Partial<Scalars['HexColorCode']>;
  Hexadecimal: Partial<Scalars['Hexadecimal']>;
  IBAN: Partial<Scalars['IBAN']>;
  IPv4: Partial<Scalars['IPv4']>;
  IPv6: Partial<Scalars['IPv6']>;
  ISBN: Partial<Scalars['ISBN']>;
  ISO8601Duration: Partial<Scalars['ISO8601Duration']>;
  Int: Partial<Scalars['Int']>;
  JSON: Partial<Scalars['JSON']>;
  JSONObject: Partial<Scalars['JSONObject']>;
  JWT: Partial<Scalars['JWT']>;
  Latitude: Partial<Scalars['Latitude']>;
  League: Partial<League>;
  LeagueStandings: Partial<LeagueStandings>;
  LocalDate: Partial<Scalars['LocalDate']>;
  LocalEndTime: Partial<Scalars['LocalEndTime']>;
  LocalTime: Partial<Scalars['LocalTime']>;
  Locale: Partial<Scalars['Locale']>;
  Long: Partial<Scalars['Long']>;
  Longitude: Partial<Scalars['Longitude']>;
  MAC: Partial<Scalars['MAC']>;
  Mutation: {};
  NegativeFloat: Partial<Scalars['NegativeFloat']>;
  NegativeInt: Partial<Scalars['NegativeInt']>;
  NonEmptyString: Partial<Scalars['NonEmptyString']>;
  NonNegativeFloat: Partial<Scalars['NonNegativeFloat']>;
  NonNegativeInt: Partial<Scalars['NonNegativeInt']>;
  NonPositiveFloat: Partial<Scalars['NonPositiveFloat']>;
  NonPositiveInt: Partial<Scalars['NonPositiveInt']>;
  ObjectID: Partial<Scalars['ObjectID']>;
  PhoneNumber: Partial<Scalars['PhoneNumber']>;
  Player: Partial<Player>;
  Port: Partial<Scalars['Port']>;
  PositiveFloat: Partial<Scalars['PositiveFloat']>;
  PositiveInt: Partial<Scalars['PositiveInt']>;
  PostalCode: Partial<Scalars['PostalCode']>;
  Query: {};
  RGB: Partial<Scalars['RGB']>;
  RGBA: Partial<Scalars['RGBA']>;
  RoutingNumber: Partial<Scalars['RoutingNumber']>;
  SafeInt: Partial<Scalars['SafeInt']>;
  StandingsTeam: Partial<StandingsTeam>;
  String: Partial<Scalars['String']>;
  Team: Partial<Team>;
  Time: Partial<Scalars['Time']>;
  TimeZone: Partial<Scalars['TimeZone']>;
  Timestamp: Partial<Scalars['Timestamp']>;
  URL: Partial<Scalars['URL']>;
  USCurrency: Partial<Scalars['USCurrency']>;
  UUID: Partial<Scalars['UUID']>;
  UnsignedFloat: Partial<Scalars['UnsignedFloat']>;
  UnsignedInt: Partial<Scalars['UnsignedInt']>;
  UtcOffset: Partial<Scalars['UtcOffset']>;
  Void: Partial<Scalars['Void']>;
}>;

export interface AccountNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AccountNumber'], any> {
  name: 'AccountNumber';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface ByteScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Byte'], any> {
  name: 'Byte';
}

export type ConferenceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Conference'] = ResolversParentTypes['Conference']> = ResolversObject<{
  abbrev?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  divisions?: Resolver<Maybe<Array<ResolversTypes['Division']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  league?: Resolver<ResolversTypes['League'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface CountryCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CountryCode'], any> {
  name: 'CountryCode';
}

export interface CurrencyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Currency'], any> {
  name: 'Currency';
}

export interface DidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DID'], any> {
  name: 'DID';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DivisionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Division'] = ResolversParentTypes['Division']> = ResolversObject<{
  abbrev?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conference?: Resolver<Maybe<ResolversTypes['Conference']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  league?: Resolver<ResolversTypes['League'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DurationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Duration'], any> {
  name: 'Duration';
}

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export interface GuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GUID'], any> {
  name: 'GUID';
}

export interface HslScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HSL'], any> {
  name: 'HSL';
}

export interface HslaScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HSLA'], any> {
  name: 'HSLA';
}

export interface HexColorCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HexColorCode'], any> {
  name: 'HexColorCode';
}

export interface HexadecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Hexadecimal'], any> {
  name: 'Hexadecimal';
}

export interface IbanScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IBAN'], any> {
  name: 'IBAN';
}

export interface IPv4ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IPv4'], any> {
  name: 'IPv4';
}

export interface IPv6ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IPv6'], any> {
  name: 'IPv6';
}

export interface IsbnScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISBN'], any> {
  name: 'ISBN';
}

export interface Iso8601DurationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISO8601Duration'], any> {
  name: 'ISO8601Duration';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export interface JwtScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JWT'], any> {
  name: 'JWT';
}

export interface LatitudeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Latitude'], any> {
  name: 'Latitude';
}

export type LeagueResolvers<ContextType = any, ParentType extends ResolversParentTypes['League'] = ResolversParentTypes['League']> = ResolversObject<{
  abbrev?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conferences?: Resolver<Maybe<Array<ResolversTypes['Conference']>>, ParentType, ContextType>;
  divisions?: Resolver<Maybe<Array<ResolversTypes['Division']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LeagueStandingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeagueStandings'] = ResolversParentTypes['LeagueStandings']> = ResolversObject<{
  league?: Resolver<ResolversTypes['League'], ParentType, ContextType>;
  teams?: Resolver<Array<ResolversTypes['StandingsTeam']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface LocalDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalDate'], any> {
  name: 'LocalDate';
}

export interface LocalEndTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalEndTime'], any> {
  name: 'LocalEndTime';
}

export interface LocalTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalTime'], any> {
  name: 'LocalTime';
}

export interface LocaleScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Locale'], any> {
  name: 'Locale';
}

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long';
}

export interface LongitudeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Longitude'], any> {
  name: 'Longitude';
}

export interface MacScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MAC'], any> {
  name: 'MAC';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createFoo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sandbox?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  simulate?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  simulateCleanup?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  simulatePrep?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
}>;

export interface NegativeFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NegativeFloat'], any> {
  name: 'NegativeFloat';
}

export interface NegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NegativeInt'], any> {
  name: 'NegativeInt';
}

export interface NonEmptyStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonEmptyString'], any> {
  name: 'NonEmptyString';
}

export interface NonNegativeFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeFloat'], any> {
  name: 'NonNegativeFloat';
}

export interface NonNegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeInt'], any> {
  name: 'NonNegativeInt';
}

export interface NonPositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonPositiveFloat'], any> {
  name: 'NonPositiveFloat';
}

export interface NonPositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonPositiveInt'], any> {
  name: 'NonPositiveInt';
}

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectID'], any> {
  name: 'ObjectID';
}

export interface PhoneNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PhoneNumber'], any> {
  name: 'PhoneNumber';
}

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = ResolversObject<{
  familyName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  givenName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface PortScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Port'], any> {
  name: 'Port';
}

export interface PositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveFloat'], any> {
  name: 'PositiveFloat';
}

export interface PositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt';
}

export interface PostalCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PostalCode'], any> {
  name: 'PostalCode';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getLeagueStandings?: Resolver<Maybe<ResolversTypes['LeagueStandings']>, ParentType, ContextType, RequireFields<QueryGetLeagueStandingsArgs, 'gameGroupId' | 'leagueId'>>;
  getOnePlayer?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType, RequireFields<QueryGetOnePlayerArgs, 'id'>>;
  getServerTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export interface RgbScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RGB'], any> {
  name: 'RGB';
}

export interface RgbaScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RGBA'], any> {
  name: 'RGBA';
}

export interface RoutingNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RoutingNumber'], any> {
  name: 'RoutingNumber';
}

export interface SafeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SafeInt'], any> {
  name: 'SafeInt';
}

export type StandingsTeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['StandingsTeam'] = ResolversParentTypes['StandingsTeam']> = ResolversObject<{
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

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = ResolversObject<{
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

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export interface TimeZoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['TimeZone'], any> {
  name: 'TimeZone';
}

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export interface UsCurrencyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['USCurrency'], any> {
  name: 'USCurrency';
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface UnsignedFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UnsignedFloat'], any> {
  name: 'UnsignedFloat';
}

export interface UnsignedIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UnsignedInt'], any> {
  name: 'UnsignedInt';
}

export interface UtcOffsetScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UtcOffset'], any> {
  name: 'UtcOffset';
}

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type Resolvers<ContextType = any> = ResolversObject<{
  AccountNumber?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Byte?: GraphQLScalarType;
  Conference?: ConferenceResolvers<ContextType>;
  CountryCode?: GraphQLScalarType;
  Currency?: GraphQLScalarType;
  DID?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Division?: DivisionResolvers<ContextType>;
  Duration?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  GUID?: GraphQLScalarType;
  HSL?: GraphQLScalarType;
  HSLA?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  Hexadecimal?: GraphQLScalarType;
  IBAN?: GraphQLScalarType;
  IPv4?: GraphQLScalarType;
  IPv6?: GraphQLScalarType;
  ISBN?: GraphQLScalarType;
  ISO8601Duration?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  JWT?: GraphQLScalarType;
  Latitude?: GraphQLScalarType;
  League?: LeagueResolvers<ContextType>;
  LeagueStandings?: LeagueStandingsResolvers<ContextType>;
  LocalDate?: GraphQLScalarType;
  LocalEndTime?: GraphQLScalarType;
  LocalTime?: GraphQLScalarType;
  Locale?: GraphQLScalarType;
  Long?: GraphQLScalarType;
  Longitude?: GraphQLScalarType;
  MAC?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  NegativeFloat?: GraphQLScalarType;
  NegativeInt?: GraphQLScalarType;
  NonEmptyString?: GraphQLScalarType;
  NonNegativeFloat?: GraphQLScalarType;
  NonNegativeInt?: GraphQLScalarType;
  NonPositiveFloat?: GraphQLScalarType;
  NonPositiveInt?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  PhoneNumber?: GraphQLScalarType;
  Player?: PlayerResolvers<ContextType>;
  Port?: GraphQLScalarType;
  PositiveFloat?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  PostalCode?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RGB?: GraphQLScalarType;
  RGBA?: GraphQLScalarType;
  RoutingNumber?: GraphQLScalarType;
  SafeInt?: GraphQLScalarType;
  StandingsTeam?: StandingsTeamResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  Time?: GraphQLScalarType;
  TimeZone?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  USCurrency?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
  UnsignedFloat?: GraphQLScalarType;
  UnsignedInt?: GraphQLScalarType;
  UtcOffset?: GraphQLScalarType;
  Void?: GraphQLScalarType;
}>;

